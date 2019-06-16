import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {DataService} from '../../../service/data.service';
import {SocketService} from '../../../service/socket.service';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {DrawGameService} from '../../../service/draw-game.service';
import {ScoreboardUser} from '../../../classes/draw/scoreboard-user';


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

    // COLORS
    private colors = [];
    minutes = 0;

    // Helpers
    private placementMaterial;
    private placementMesh;
    private isShift = false;
    seconds = 0;
    private selectedColor = '#4286f4';
    private controls;

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

    constructor(private dataservice: DataService, private socketService: SocketService, public drawgameservice: DrawGameService) {
    }

    ngOnInit() {
        this.init();
        this.socketService.drawGameEmitter.subscribe(res => {
            if (res.type === 'updateGame') {
                if (res.mode === 'place') {
                    const tmpBlock = new THREE.BoxBufferGeometry(50, 50, 50);
                    const tmpcubeMaterial = new THREE.MeshLambertMaterial({color: res.color});
                    const tmpCube = new THREE.Mesh(tmpBlock, tmpcubeMaterial);
                    tmpCube.position.set(res.x, res.y, res.z);
                    this.scene.add(tmpCube);
                    this.objects.push(tmpCube);
                } else {
                    this.objects.splice(res.removeIndex, 1);
                    this.scene.children.forEach(c => {
                        if (c.position.x === res.x && c.position.y === res.y && c.position.z === res.z) {
                            this.scene.remove(c);
                        }
                    });
                }
                this.render();
            } else if (res.type === 'start') {
                this.dataservice.blockzUser.role = this.dataservice.blockzUser.sessionID === res.drawer ? 'DRAWER' : 'GUESSER';
            }
        });
    }

    ngAfterViewInit(): void {
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.margin = 'auto';
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(new THREE.Color(0xeeeeee));
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
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
        if (this.isDrawer()) {
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
    }

    @HostListener('click', ['$event'])
    setBlock(event) {
        event.preventDefault();
        if (this.isDrawer()) {
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
                        this.socketService.send(JSON.parse('{"type": "updateGame", "game": "' + this.dataservice.blockzUser.game + '",' +
                            '"x": ' + intersect.object.position.x + ', "y": '
                            + intersect.object.position.y + ', "z": ' + intersect.object.position.z + ', "color": "", "mode": "remove"}'));
                    }
                    // create cube
                } else {
                    const newCube = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
                    newCube.position.copy(intersect.point).add(intersect.face.normal);
                    newCube.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    this.scene.add(newCube);
                    this.objects.push(newCube);
                    this.socketService.send(JSON.parse('{"type": "updateGame", "game": "' + this.dataservice.blockzUser.game + '",' +
                        ' "x": ' + newCube.position.x + ', "y": ' + newCube.position.y + ',"z": ' + newCube.position.z + ', "color": "'
                        + this.selectedColor + '", "mode": "place"}'));
                }

            }
        }
        this.render();
    }

    @HostListener('window: keydown', ['$event'])
    setShift(event) {
        if (event.shiftKey || event.keyCode === 16) {
            this.isShift = true;
        }
    }

    @HostListener('window: keyup', ['$event'])
    unsetShift(event) {
        if (event.shiftKey || event.keyCode === 16) {
            this.isShift = false;
        }
    }

    isDrawer(): boolean {
        return this.dataservice.blockzUser.role === 'DRAWER';
    }

    selectColor(color) {
        this.selectedColor = '#' + color.toString(16);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: this.selectedColor});
    }

    private init() {
        this.initScoreboard();
        this.objects = [];
        this.colors = [];
        this.scene = new THREE.Scene();

        // SET THE COLORS
        this.colors.push(0x4286f4);
        this.colors.push(0xf44242);


        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);
        this.scene.background = new THREE.Color(0xf0f0f0);
        this.scene.add(new THREE.GridHelper(1000, 20));


        // Placement Helpers
        const placementHelperBox = new THREE.BoxBufferGeometry(50, 50, 50);
        this.placementMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
        this.placementMesh = new THREE.Mesh(placementHelperBox, this.placementMaterial);

        if (this.isDrawer()) {
            this.scene.add(this.placementMesh);
        }

        // Cubes
        this.cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: this.selectedColor});

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

        // Ambient Light
        const light = new THREE.AmbientLight(0x606060);
        this.scene.add(light);

        // Light for the cubes
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);

        // Adding the Camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Adding the timer
        let timecount = this.drawgameservice.getTimer() * 60;
        const interv = setInterval(i => {
            if (timecount > 0) {
                this.minutes = Math.floor(timecount / 60);
                this.seconds = timecount - this.minutes * 60;
                timecount -= 1;
            } else if (timecount == 0) {
                this.drawgameservice.nextRound();
                this.init();
                // Only the drawer should send the Request
                if (this.isDrawer()) {
                    this.socketService.send(JSON.parse('{"type": "nextRound"}'));
                }
                clearInterval(interv);
            }
        }, 1000);
    }

    private initScoreboard() {
        if (this.drawgameservice.getRound() === 1) {
            for (const p of this.dataservice.players) {
                this.drawgameservice.getScoreboard().push(new ScoreboardUser(p['sessionID'], 0));
            }
        }
    }

    private resolveNameFromSession(session) {
        for (const o of this.dataservice.players) {
            if (o['sessionID'] === session) {
                return decodeURIComponent(o['username']);
            }
        }
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
