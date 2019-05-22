import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../service/data.service';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import {BlockzPlayer} from '../../classes/blockz-player';
import {SocketService} from '../../service/socket.service';
import {GameConfig} from '../../classes/game-config';
import {Block} from '../../classes/block';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
    // SCENE CONFIG
    @ViewChild('blockzRender') rendererContainer: ElementRef;
    private players: Array<BlockzPlayer> = [];
    private currentPlayer: BlockzPlayer = new BlockzPlayer(this.dataservice.blockzUser);
    private isSpacePressed: boolean = false;
    private width: number = window.innerWidth;
    private height: number = window.innerHeight;
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera = null;

    constructor(public dataservice: DataService, private socketService: SocketService) {
    }

    ngOnInit() {
        this.players.push(this.currentPlayer);
        this.initBasicScene();
    }

    ngAfterViewInit(): void {
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.margin = 'auto';
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(new THREE.Color(0xeeeeee));
        this.renderer.render(this.scene, this.camera);
    }

    @HostListener('window:keypress', ['$event'])
    public move(event: KeyboardEvent) {
        // requestAnimationFrame(this.move);
        console.log('TRIGGERED');
        event.preventDefault();
        switch (event.key) {
            case 'w':
                this.camera.position.x += Math.sin(this.camera.rotation.y - Math.PI / 2) * this.currentPlayer.speed;
                this.camera.position.z += -Math.cos(this.camera.rotation.y - Math.PI / 2) * this.currentPlayer.speed;
                break;
            case 'a':
                this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.currentPlayer.speed;
                this.camera.position.z -= -Math.cos(this.camera.rotation.y) * this.currentPlayer.speed;
                break;
            case 's':
                this.camera.position.x += Math.sin(this.camera.rotation.y + Math.PI / 2) * this.currentPlayer.speed;
                this.camera.position.z += -Math.cos(this.camera.rotation.y + Math.PI / 2) * this.currentPlayer.speed;
                break;
            case 'd':
                this.camera.position.x += Math.sin(this.camera.rotation.y) * this.currentPlayer.speed;
                this.camera.position.z += -Math.cos(this.camera.rotation.y) * this.currentPlayer.speed;
                break;
            case ' ': // SPACE KEY
                this.isSpacePressed = true;
                break;
            // Keyboard turn inputs
            case 'ArrowLeft':
                this.camera.rotation.y -= this.currentPlayer.turnSpeed;
                break;
            case 'ArrowRight':
                this.camera.rotation.y += this.currentPlayer.turnSpeed;
                break;
            default:
                break;
        }
        // Keyboard movement inputs
        this.currentPlayer.position = this.camera.position;
        this.render();
        this.socketService.send(JSON.parse('{"type": "update", "game": "' + this.currentPlayer.game + '", "players": "'
            + this.players.toString() + '", "scene": "' + this.scene.toJSON() + '"}'));
    }

    private initBasicScene(): void {
        // Setup the camera
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(new THREE.Vector3(0, this.currentPlayer.height, 0));
        // Add a light
        const light = new THREE.AmbientLight(0x404040);
        light.position.set(-15, -15, -15);
        // Add the floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 100, 100),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}
            ));
        floor.rotation.x -= Math.PI / 2;

        // Add the Objects to the scene
        this.scene.add(light);
        this.scene.add(floor);

        // Adds the cool Camera control with Space + Drag
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    @HostListener('window:keyup', ['$event'])
    private release(event: KeyboardEvent) {
        if (event.key === ' ') {
            this.isSpacePressed = false;
        }
    }

    @HostListener('window:mousedown', ['$event'])
    private placeCube() {
        if (!this.isSpacePressed) {
            const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 5), new THREE.MeshLambertMaterial({color: 0xfeb74c}));
            cube.position.add(new THREE.Vector3(this.camera.position.x / 2, 0, this.camera.position.z / 2));
            this.currentPlayer.cubes.push(new Block(this.currentPlayer, cube));
            this.scene.add(cube);
            this.render();
        }
    }

    // Method for updating the Scene
    private updateScene(gameConfig: GameConfig) {
        this.scene = gameConfig.scene;
        this.render();
    }
}
