import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { KeyboardEventTypes } from '@babylonjs/core/Events/keyboardEvents';
import { Animation } from '@babylonjs/core/Animations/animation';
import { CreateBox, VertexData } from '@babylonjs/core/Meshes';
import { Material } from '@babylonjs/core/Materials/material';
import { Mesh } from '@babylonjs/core/Meshes/mesh';

const BASE_URL = import.meta.env.BASE_URL || '/';

class Renderer {
    constructor(canvas, engine, material_callback, ground_mesh_callback) {
        this.canvas = canvas;
        this.engine = engine;
        this.scenes = [
            {
                // SCENE 0
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                // SCENE 1
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                // SCENE 2
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.4, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                // SCENE 3
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            }
        ];
        this.active_scene = 0;
        this.active_light = 0;
        this.shading_alg = 'gouraud';

        this.update_light_pos = new Vector3(0.0, 0.0, 0.0);

        this.scenes.forEach((scene, idx) => {
            scene.materials = material_callback(scene.scene);
            scene.ground_mesh = ground_mesh_callback(scene.scene, scene.ground_subdivisions);
            this['createScene'+ idx](idx);
        });
    }

    createScene0(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        //let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        let light0 = new PointLight('light0', new Vector3(5.0, 6.0, 6.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(1.0, 1.0, 1.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.10, 0.65, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];

        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        // Custom Model
        let noah = new Mesh('noah', scene);
        let vertex_positions = [
            3.0, 3.0, 3.0,
            4.0, 4.0, 3.0,
            3.0, 5.0, 3.0,
            2.0, 4.0, 3.0, 
            2.0, 3.0, 2.0,
            2.0, 5.0, 2.0,
            4.0, 3.0, 2.0, 
            4.0, 5.0, 2.0,

            //back
            3.0, 3.0, 1.0,  //8
            4.0, 4.0, 1.0,
            3.0, 5.0, 1.0,
            2.0, 4.0, 1.0, 
        ];
        let triangle_indices = [
            //face
            0, 1, 2,
            0, 2, 3,
            //corners
            0, 3, 4,
            2, 3, 5,
            0, 1, 6,
            2, 1, 7,
            //sides
            3, 4, 5,
            2, 5, 7,
            1, 6, 7,
            0, 4, 6,

            //back
            8, 9, 10,
            8, 10, 11,
            //corners
            8, 11, 4,
            10, 11, 5,
            8, 9, 6,
            10, 9, 7,
            //sides
            11, 4, 5,
            10, 5, 7,
            9, 6, 7,
            8, 4, 6
        ];
        let normals = [];
        VertexData.ComputeNormals(vertex_positions, triangle_indices, normals);
        let vertex_data = new VertexData();
        vertex_data.positions = vertex_positions;
        vertex_data.indices = triangle_indices;
        vertex_data.normals = normals;
        vertex_data.applyToMesh(noah, true);
        noah.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        noah.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(noah);
    
        this.addKeyBinds(scene);
        // console.log(current_scene.lights[0]);
        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // new_light_pos = this.update_light_pos + current_scene.lights[this.active_light].get
            current_scene.lights[this.active_light].position.x +=  this.update_light_pos.x;
            current_scene.lights[this.active_light].position.y +=  this.update_light_pos.y;
            current_scene.lights[this.active_light].position.z +=  this.update_light_pos.z;
            this.update_light_pos = new Vector3(0.0, 0.0, 0.0);


            
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }
    createScene1(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;
    }

    createScene2(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        //let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        let light0 = new PointLight('light0', new Vector3(5.0, 6.0, 6.0), scene);
        light0.diffuse = new Color3(0.0, 0.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(1.0, 0.0, 0.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let earth = new Texture('https://www.babylonjs-playground.com/textures/earth.jpg', scene);
        let ground_heightmap = new Texture('/heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(50.0, 2.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(1.0, 0.0, 0.0),
            mat_texture: earth,
            mat_specular: new Color3(.5, .5, .5),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];

        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        let box = CreateBox('box', {size: 2}, scene);
        box.position = new Vector3(0.0, 0.5, 5.0);
        box.metadata = {
            mat_color: new Color3(0.10, 0.88, 0.35),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);

        
        //VertexData.ComputeNormals(vertex_positions, triangle_indices, normals);
        this.addKeyBinds(scene);
        // console.log(current_scene.lights[0]);
        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // new_light_pos = this.update_light_pos + current_scene.lights[this.active_light].get
            current_scene.lights[this.active_light].position.x +=  this.update_light_pos.x;
            current_scene.lights[this.active_light].position.y +=  this.update_light_pos.y;
            current_scene.lights[this.active_light].position.z +=  this.update_light_pos.z;
            this.update_light_pos = new Vector3(0.0, 0.0, 0.0);


            
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene3(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let metal = new Texture('https://www.babylonjs-playground.com/textures/reflectivity', scene);
        let ground_heightmap = new Texture('/heightmaps/default.png', scene);

        // Create point light sources
        //let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        let light0 = new PointLight('light0', new Vector3(0.0, 10.0, -25.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 0.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let box0 = CreateSphere('box0', {segments: 32}, scene);
        box0.position = new Vector3(0.0, 0.5, -20.0);
        box0.metadata = {
            mat_color: new Color3(0.30, 0.35, 0.30),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 32,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box0.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box0);



        let light1 = new PointLight('light1', new Vector3(20.0, 10.0, -20.0), scene);
        light1.diffuse = new Color3(0.0, 1.0, 0.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        let box1 = CreateBox('box1', {size: 3}, scene);
        box1.position = new Vector3(20.0, 0.5, -20.0);
        box1.metadata = {
            mat_color: new Color3(0.30, 0.35, 0.30),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 32,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box1);


        let light2 = new PointLight('light2', new Vector3(20.0, 10.0, 0.0), scene);
        light1.diffuse = new Color3(0.0, 0.0, 1.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light2);

        let box2 = CreateBox('box2', {size: 3}, scene);
        box2.position = new Vector3(20.0, 0.5, -0.0);
        box2.metadata = {
            mat_color: new Color3(0.30, 0.35, 0.30),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 32,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box2.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box2);



        // let light3 = new PointLight('light3', new Vector3(5.0, 8.0, 0.0), scene);
        // light1.diffuse = new Color3(1.0, 0.0, 1.0);
        // light1.specular = new Color3(1.0, 1.0, 1.0);
        // current_scene.lights.push(light3);

        // let light4 = new PointLight('light4', new Vector3(5.0, 8.0, 0.0), scene);
        // light1.diffuse = new Color3(1.0, 0.0, 1.0);
        // light1.specular = new Color3(1.0, 1.0, 1.0);
        // current_scene.lights.push(light4);

        // let light5 = new PointLight('light5', new Vector3(5.0, 8.0, 0.0), scene);
        // light1.diffuse = new Color3(1.0, 0.0, 1.0);
        // light1.specular = new Color3(1.0, 1.0, 1.0);
        // current_scene.lights.push(light5);

        // let light6 = new PointLight('light6', new Vector3(5.0, 8.0, 0.0), scene);
        // light1.diffuse = new Color3(1.0, 0.0, 1.0);
        // light1.specular = new Color3(1.0, 1.0, 1.0);
        // current_scene.lights.push(light6);

        // let light7 = new PointLight('light7', new Vector3(5.0, 8.0, 0.0), scene);
        // light1.diffuse = new Color3(1.0, 0.0, 1.0);
        // light1.specular = new Color3(1.0, 1.0, 1.0);
        // current_scene.lights.push(light7);





        // Create ground mesh
        ground_mesh.scaling = new Vector3(50.0, 2.0, 50.0);
        ground_mesh.metadata = {
            mat_color: new Color3(.2, .2, .2),
            mat_texture: white_texture,
            mat_specular: new Color3(.5, .5, .5),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];


        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        let box = CreateBox('box', {size: 2}, scene);
        box.position = new Vector3(0.0, 0.5, 5.0);
        box.metadata = {
            mat_color: new Color3(0.10, 0.88, 0.35),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);

        
        //VertexData.ComputeNormals(vertex_positions, triangle_indices, normals);
        this.addKeyBinds(scene);
        // console.log(current_scene.lights[0]);
        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // new_light_pos = this.update_light_pos + current_scene.lights[this.active_light].get
            current_scene.lights[this.active_light].position.x +=  this.update_light_pos.x;
            current_scene.lights[this.active_light].position.y +=  this.update_light_pos.y;
            current_scene.lights[this.active_light].position.z +=  this.update_light_pos.z;
            this.update_light_pos = new Vector3(0.0, 0.0, 0.0);


            
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }


    updateShaderUniforms(scene_idx, shader) {
        let current_scene = this.scenes[scene_idx];
        shader.setVector3('camera_position', current_scene.camera.position);
        shader.setColor3('ambient', current_scene.scene.ambientColor);
        shader.setInt('num_lights', current_scene.lights.length);
        let light_positions = [];
        let light_colors = [];
        current_scene.lights.forEach((light) => {
            light_positions.push(light.position.x, light.position.y, light.position.z);
            light_colors.push(light.diffuse);
        });
        shader.setArray3('light_positions', light_positions);
        shader.setColor3Array('light_colors', light_colors);
    }

    getActiveScene() {
        return this.scenes[this.active_scene].scene;
    }
    
    setActiveScene(idx) {
        this.active_scene = idx;
    }

    setShadingAlgorithm(algorithm) {
        this.shading_alg = algorithm;

        this.scenes.forEach((scene) => {
            let materials = scene.materials;
            let ground_mesh = scene.ground_mesh;

            ground_mesh.material = materials['ground_' + this.shading_alg];
            scene.models.forEach((model) => {
                model.material = materials['illum_' + this.shading_alg];
            });
        });
    }

    setHeightScale(scale) {
        this.scenes.forEach((scene) => {
            let ground_mesh = scene.ground_mesh;
            ground_mesh.metadata.height_scalar = scale;
        });
    }

    setActiveLight(idx) {
        console.log(idx);
        this.active_light = idx;
    }


    addKeyBinds(scene){
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type == KeyboardEventTypes.KEYDOWN){
                switch (kbInfo.event.key){
                    case "a":
                        this.update_light_pos.x = -1;
                        break;
                    
                    case "d":
                        this.update_light_pos.x = 1;
                        break;

                    case "f":
                        this.update_light_pos.y = -1;
                        break;
                
                    case "r":
                        this.update_light_pos.y = 1;
                        break;
                    
                    case "w":
                        this.update_light_pos.z = -1;
                        break;

                    case "s":
                        this.update_light_pos.z = 1;
                        break;
                }
            }
          });
    }

}

export { Renderer }