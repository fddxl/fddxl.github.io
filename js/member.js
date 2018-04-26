var canvas;
var renderer;
var scenes = [];
var loader = new THREE.STLLoader();

window.onload = function() {
    canvas = document.getElementById("canvas");

    var geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.5, 12, 8),
        new THREE.DodecahedronGeometry(0.5),
        new THREE.CylinderGeometry(0.5, 0.5, 1, 12)
    ];

    var template = document.getElementById("threejs-template").text;

    function addMember(content, memberlist) {
        if (content == null) {return;}

        for (name in memberlist) {
            var scene = new THREE.Scene();
            scene.background = new THREE.Color(0x444444);

            var element = document.createElement("div");
            element.className = "list-item";
            element.innerHTML = template.replace('$', name);

            scene.userData.element = element.querySelector(".scene");
            content.appendChild(element);

            var description = element.querySelector(".description");

            if (memberlist[name]['title'] != "") {
                var detail = document.createElement("div");
                detail.className = "title";
                detail.innerHTML = '<small>' + memberlist[name]['title'] + '</small>';
                description.appendChild(detail);
            }

            if (memberlist[name]['join'] != "") {
                var detail = document.createElement("div");
                detail.className = "join";
                detail.innerHTML = '<small>Joined in ' + memberlist[name]['join'] + '</small>';
                description.appendChild(detail);
            }

            var camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
            camera.position.z = 2;
            scene.userData.camera = camera;

            var controls = new THREE.OrbitControls(scene.userData.camera, scene.userData.element);
            controls.minDistance = 2;
            controls.maxDistance = 5;
            controls.enablePan = false;
            controls.enableZoom = false;
            scene.userData.controls = controls;

            if (memberlist[name]['stldata'] != "") {
                loadSTL(memberlist[name]['stldata'], scene);
            } else {
                var geometry = geometries[geometries.length * Math.random() | 0];

                var material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.5, 1.0),
                    roughness: 0.5,
                    metalness: 0,
                    shading: THREE.FlatShading
                });

                var primitive = new THREE.Mesh(geometry, material);
                primitive.rotation.x = -Math.PI/2;

                scene.add(primitive);
                scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

                var light = new THREE.DirectionalLight(0xffffff, 0.5);
                light.position.set(1, 1, 1);
                scene.add(light);

                scenes.push(scene);
            }
        }
    }

    addMember(document.getElementById("current-member-professor"), memberListProfessor);
    addMember(document.getElementById("current-member-project"), memberListProject);
    addMember(document.getElementById("current-member-visiting"), memberListVisiting);
    addMember(document.getElementById("current-member-graduate"), memberListGraduate);
    addMember(document.getElementById("current-member-undergraduate"), memberListUndergraduate);

    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);

    animate();
}

function updateSize() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    if (canvas.width != width || canvas.height != height) {
        renderer.setSize(width, height, false);
    }
}

function animate() {
    render();
    requestAnimationFrame(animate);
}

function render() {
    updateSize();

    renderer.setClearColor(0xffffff, 0);
    renderer.setScissorTest(false);
    renderer.clear();

    renderer.setClearColor(0xe0e0e0);
    renderer.setScissorTest(true);

    scenes.forEach(function(scene) {
        scene.children[0].rotation.z += 0.001;

        var element = scene.userData.element;

        var rect = element.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth) {return;}

        var width = rect.right - rect.left;
        var height = rect.bottom - rect.top;
        var left = rect.left;
        var bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);

        var camera = scene.userData.camera;

        renderer.render(scene, camera);
    })
}

function loadSTL(fileName, scene) {
    loader.load(fileName, function(geometry) {
        geometry.computeBoundingBox();
        geometry.center();

        var bbox = geometry.boundingBox;
        var scale = Math.max(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y, bbox.max.z - bbox.min.z);
        scale = 1.7 / scale

        var material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.5, 1.0),
            roughness: 0.5,
            metalness: 0,
            shading: THREE.FlatShading
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = -0.1;
        mesh.rotation.set(-Math.PI/2, 0, 0);
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);
        scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

        var light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(1, 1, 1);
        scene.add(light);

        scenes.push(scene);
    });
}
