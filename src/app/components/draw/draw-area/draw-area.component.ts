import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';


@Component({
    selector: 'draw-area',
    templateUrl: './draw-area.component.html',
    styleUrls: ['./draw-area.component.css']
})
export class DrawAreaComponent implements OnInit, AfterViewInit {
    @ViewChild('drawRender') rendererContainer: ElementRef;
    private width: number = window.innerWidth - 300;
    private height: number = window.innerHeight;
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera = null;

    // Helpers
    private placementMaterial;
    private placementMesh;
    private isShift = false;

    // Cubes
    private cubeGeo;
    private cubeMaterial;

    // Grid
    private grid;
    private gridHelper;

    // Raycaster
    private raycast;
    private mouse;

    // Objects
    private objects = [];

    constructor() {
    }

    ngOnInit() {
        this.init();
    }

    ngAfterViewInit(): void {
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.margin = 'auto';
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(new THREE.Color(0xeeeeee));
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    private init() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);
        this.scene.background = new THREE.Color(0xf0f0f0);
        this.scene.add(new THREE.GridHelper(1000, 20));


        // Placement Helpers
        const placementHelperBox = new THREE.BoxBufferGeometry(50, 50, 50);
        this.placementMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
        this.placementMesh = new THREE.Mesh(placementHelperBox, this.placementMaterial);

        this.scene.add(this.placementMesh);

        // Cubes
        this.cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: 0x4286f4}); // TODO CHANGE IT TO SELECTED COLOR

        // Grid
        this.gridHelper = new THREE.GridHelper(1000, 20);
        this.scene.add(this.gridHelper);

        // Raycaster
        this.raycast = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        const planeGeo = new THREE.PlaneBufferGeometry(1000, 1000);
        planeGeo.rotateX(-Math.PI / 2);
        this.grid = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({visible: false}));
        this.scene.add(this.grid);
        this.objects.push(this.grid);

        const light = new THREE.AmbientLight(0x606060);
        this.scene.add(light);
    }

    @HostListener('window: resize', ['$event'])
    onResize(event) {
        this.width = event.target.innerWidth - 300;
        this.height = event.target.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.render();
    }

    @HostListener('mousemove', ['$event'])
    movePlaceHolder(event) {
        event.preventDefault();
        this.mouse.set((event.clientX / (window.innerWidth - 300)) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        this.raycast.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycast.intersectObjects(this.objects);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            this.placementMesh.position.copy(intersect.point).add(intersect.face.normal);
            this.placementMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        }
        this.render();
    }

    @HostListener('click', ['$event'])
    setBlock(event) {
        event.preventDefault();
        this.mouse.set((event.clientX / (window.innerWidth - 300)) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        this.raycast.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycast.intersectObjects(this.objects);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            // delete cube
            if (this.isShift) {
                if (intersect.object !== this.grid) {
                    this.scene.remove(intersect.object);
                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }
                // create cube
            } else {
                const newCube = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
                newCube.position.copy(intersect.point).add(intersect.face.normal);
                newCube.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                this.scene.add(newCube);
                this.objects.push(newCube);
            }
            this.render();
        }
    }

    @HostListener('keydown', ['$event'])
    setShift(event) {
        if (event.shiftKey) {
            this.isShift = true;
        }
    }

    @HostListener('keyup', ['$event'])
    unsetShift(event) {
        if (event.shiftKey) {
            this.isShift = false;
        }
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
