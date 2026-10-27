import * as THREE from 'three';
const forestSound = new Audio('/audio/forest.wav');
forestSound.loop = true;
forestSound.volume = 0.25;

const magicWhoosh = new Audio('/audio/magic-whoosh.wav');
magicWhoosh.volume = 0.65;

const magicChime = new Audio('/audio/magic-chime.wav');
magicChime.volume = 0.7;

function playSound(sound) {
    sound.currentTime = 0;

    sound.play().catch((error) => {
        console.warn('Audio playback failed:', error);
    });
}

// ======================================
// 1. SCENE, CAMERA AND RENDERER
// ======================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x071126);
scene.fog = new THREE.FogExp2(0x071126, 0.012);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 7, 20);
camera.lookAt(0, 3, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// ======================================
// 2. LIGHTING
// ======================================

const ambientLight = new THREE.AmbientLight(0x8299d8, 1.8);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x91baff, 3);
moonLight.position.set(-8, 15, 8);
moonLight.castShadow = true;
scene.add(moonLight);

// ======================================
// 3. GROUND
// ======================================

const groundGeometry = new THREE.PlaneGeometry(200, 200);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x102b25,
    roughness: 1
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.receiveShadow = true;

scene.add(ground);

// ======================================
// 4. MOON
// ======================================

const moonGeometry = new THREE.SphereGeometry(2, 48, 48);

const moonMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff0c2
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);

moon.position.set(-9, 12, -20);

scene.add(moon);

// Moon glow
const moonGlow = new THREE.PointLight(0xffdba0, 90, 60);

moonGlow.position.copy(moon.position);

scene.add(moonGlow);

// ======================================
// 5. STAR FIELD
// ======================================

const starCount = 900;

const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);

for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 180;
    starPositions[i * 3 + 1] = Math.random() * 75 + 5;
    starPositions[i * 3 + 2] = -Math.random() * 100 - 10;

    starSizes[i] = Math.random() * 1.5 + 0.4;
}

const starFieldGeometry = new THREE.BufferGeometry();

starFieldGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starPositions, 3)
);

starFieldGeometry.setAttribute(
    'size',
    new THREE.BufferAttribute(starSizes, 1)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.22,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
});

const stars = new THREE.Points(starFieldGeometry, starMaterial);

scene.add(stars);

// ======================================
// 6. ENCHANTED FOREST
// ======================================

function createTree(x, z, scale = 1) {
    const tree = new THREE.Group();

    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(
        0.2 * scale,
        0.35 * scale,
        2 * scale,
        8
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x51352a,
        roughness: 1
    });

    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

    trunk.position.y = scale;
    trunk.castShadow = true;

    tree.add(trunk);

    // Three layers of foliage
    const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x174a3a,
        roughness: 1
    });

    for (let i = 0; i < 3; i++) {
        const foliageGeometry = new THREE.ConeGeometry(
            (1.5 - i * 0.25) * scale,
            2.2 * scale,
            9
        );

        const foliage = new THREE.Mesh(
            foliageGeometry,
            foliageMaterial
        );

        foliage.position.y = (2 + i * 1.1) * scale;
        foliage.castShadow = true;

        tree.add(foliage);
    }

    tree.position.set(x, 0, z);

    scene.add(tree);

    return tree;
}

// Place trees along both sides of the scene
for (let i = 0; i < 45; i++) {
    const z = -i * 2.4;

    createTree(-8 - Math.random() * 5, z, 0.8 + Math.random() * 0.7);
    createTree(8 + Math.random() * 5, z, 0.8 + Math.random() * 0.7);
}

// Additional distant trees
for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 70;
    const z = -20 - Math.random() * 65;

    if (Math.abs(x) > 14) {
        createTree(x, z, 0.6 + Math.random() * 0.6);
    }
}

// ======================================
// 7. MAGICAL FIREFLIES
// ======================================

const fireflyCount = 140;

const fireflyPositions = new Float32Array(fireflyCount * 3);

for (let i = 0; i < fireflyCount; i++) {
    fireflyPositions[i * 3] = (Math.random() - 0.5) * 24;
    fireflyPositions[i * 3 + 1] = Math.random() * 6 + 0.5;
    fireflyPositions[i * 3 + 2] = -Math.random() * 60;
}

const fireflyGeometry = new THREE.BufferGeometry();

fireflyGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(fireflyPositions, 3)
);

const fireflyMaterial = new THREE.PointsMaterial({
    color: 0x8dffb0,
    size: 0.18,
    transparent: true,
    opacity: 0.9
});

const fireflies = new THREE.Points(
    fireflyGeometry,
    fireflyMaterial
);

scene.add(fireflies);

// ======================================
// 7.5. CREATE OUR LITTLE FOX
// ======================================

const fox = new THREE.Group();
const foxBody = new THREE.Group();

fox.add(foxBody);

// Materials
const foxOrange = new THREE.MeshStandardMaterial({
    color: 0xf07832,
    roughness: 0.8
});

const foxCream = new THREE.MeshStandardMaterial({
    color: 0xffe4bb,
    roughness: 0.85
});

const foxDark = new THREE.MeshStandardMaterial({
    color: 0x39251f,
    roughness: 0.7
});

const foxEyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x160f12,
    roughness: 0.25
});

const foxNoseMaterial = new THREE.MeshStandardMaterial({
    color: 0x24151a,
    roughness: 0.35
});

// Helper function for creating ellipsoids
function createFoxPart(
    parent,
    geometry,
    material,
    position,
    scale = [1, 1, 1]
) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
}

// BODY
const foxTorso = createFoxPart(
    foxBody,
    new THREE.SphereGeometry(1, 32, 24),
    foxOrange,
    [0, 1.05, 0],
    [0.72, 0.78, 1.05]
);

// White belly
createFoxPart(
    foxBody,
    new THREE.SphereGeometry(1, 24, 20),
    foxCream,
    [0, 0.94, 0.72],
    [0.46, 0.58, 0.32]
);

// HEAD
const foxHead = new THREE.Group();

foxHead.position.set(0, 2.05, 0.72);

foxBody.add(foxHead);

// Main head
createFoxPart(
    foxHead,
    new THREE.SphereGeometry(1, 32, 24),
    foxOrange,
    [0, 0, 0],
    [0.72, 0.7, 0.65]
);

// Cheeks
for (const side of [-1, 1]) {
    createFoxPart(
        foxHead,
        new THREE.SphereGeometry(0.3, 20, 16),
        foxCream,
        [side * 0.39, -0.22, 0.47],
        [1, 0.75, 0.7]
    );
}

// Muzzle
createFoxPart(
    foxHead,
    new THREE.SphereGeometry(0.32, 24, 20),
    foxCream,
    [0, -0.29, 0.62],
    [0.82, 0.58, 0.82]
);

// Nose
createFoxPart(
    foxHead,
    new THREE.SphereGeometry(0.095, 20, 16),
    foxNoseMaterial,
    [0, -0.17, 0.91],
    [1, 0.8, 0.8]
);

// EYES
for (const side of [-1, 1]) {
    createFoxPart(
        foxHead,
        new THREE.SphereGeometry(0.115, 24, 20),
        foxEyeMaterial,
        [side * 0.29, 0.06, 0.565],
        [0.82, 1.15, 0.55]
    );

    // Eye highlight
    createFoxPart(
        foxHead,
        new THREE.SphereGeometry(0.035, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        [side * 0.29 - 0.025, 0.105, 0.62],
        [1, 1, 0.6]
    );
}

// POINTED EARS
const ears = [];

for (const side of [-1, 1]) {
    const ear = new THREE.Group();

    ear.position.set(side * 0.43, 0.52, -0.02);

    const outerEar = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.78, 4),
        foxOrange
    );

    outerEar.position.y = 0.28;
    outerEar.rotation.z = -side * 0.13;

    ear.add(outerEar);

    const innerEar = new THREE.Mesh(
        new THREE.ConeGeometry(0.13, 0.49, 4),
        foxCream
    );

    innerEar.position.set(0, 0.3, 0.145);
    innerEar.rotation.z = -side * 0.13;

    ear.add(innerEar);

    foxHead.add(ear);
    ears.push(ear);
}

// FOUR LEGS
const legs = [];

for (const side of [-1, 1]) {
    for (const frontBack of [-1, 1]) {
        const leg = new THREE.Group();

        leg.position.set(
            side * 0.43,
            0.76,
            frontBack === 1 ? 0.63 : -0.63
        );

        const legMesh = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.16, 0.42, 4, 8),
            foxOrange
        );

        legMesh.position.y = -0.22;
        leg.add(legMesh);

        const paw = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 16, 12),
            foxDark
        );

        paw.scale.set(1, 0.65, 1.2);
        paw.position.set(0, -0.47, 0.05);

        leg.add(paw);

        leg.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });

        foxBody.add(leg);
        legs.push({ mesh: leg, side, frontBack });
    }
}

// FLUFFY TAIL
const tail = new THREE.Group();

tail.position.set(0, 1.25, -0.77);
tail.rotation.x = -0.3;

foxBody.add(tail);

// Main orange tail
createFoxPart(
    tail,
    new THREE.SphereGeometry(0.6, 24, 20),
    foxOrange,
    [0, 0.12, -0.65],
    [0.48, 0.48, 1.2]
);

// White tail tip
createFoxPart(
    tail,
    new THREE.SphereGeometry(0.43, 24, 20),
    foxCream,
    [0, 0.12, -1.15],
    [0.4, 0.4, 0.55]
);

// PLACE FOX IN THE FOREST
fox.position.set(0, 0, 4);
fox.rotation.y = Math.PI;
fox.scale.setScalar(1.25);

scene.add(fox);

console.log('Our little fox has been created!');

// ======================================
// 7.6. THE FALLING STAR
// ======================================

const starGroup = new THREE.Group();

const goldenStarMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc928,
    emissive: 0xffa500,
    emissiveIntensity: 2.5,
    metalness: 0.2,
    roughness: 0.3
});

function createStarShape() {
    const shape = new THREE.Shape();

    const outerRadius = 1;
    const innerRadius = 0.45;

    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }

    shape.closePath();

    return shape;
}

const starShape = createStarShape();

// Use a unique variable name so it does not conflict with the background stars.
const fallingStarGeometry = new THREE.ExtrudeGeometry(starShape, {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08
});

fallingStarGeometry.center();

const fallingStar = new THREE.Mesh(
    fallingStarGeometry,
    goldenStarMaterial
);

fallingStar.scale.setScalar(0.8);

starGroup.add(fallingStar);

// Golden light around the star
const fallingStarLight = new THREE.PointLight(
    0xffbb33,
    35,
    18
);

fallingStarLight.position.set(0, 0, 1);

starGroup.add(fallingStarLight);

// Sparkle particles
const sparkleCount = 100;
const sparklePositions = new Float32Array(sparkleCount * 3);

for (let i = 0; i < sparkleCount; i++) {
    sparklePositions[i * 3] = (Math.random() - 0.5) * 3;
    sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
    sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
}

const sparkleGeometry = new THREE.BufferGeometry();

sparkleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(sparklePositions, 3)
);

const sparkleMaterial = new THREE.PointsMaterial({
    color: 0xffd75e,
    size: 0.12,
    transparent: true,
    opacity: 0.9
});

const starSparkles = new THREE.Points(
    sparkleGeometry,
    sparkleMaterial
);

starGroup.add(starSparkles);

// Initial position; the star remains hidden until Scene 2
starGroup.position.set(0, 14, -8);
starGroup.visible = false;

scene.add(starGroup);

console.log('The falling star is ready!');

// ======================================
// 8. ANIMATION LOOP
// ======================================

const clock = new THREE.Clock();

let adventureStarted = false;
let adventureTime = 0;

let starFallStarted = false;
let starFallTime = 0;

let foxApproachingStar = false;
let foxApproachTime = 0;

let starFoundTime = 0;
let starReturning = false;

let endingStarted = false;

// Starting position of the fox
const foxStartZ = 4;

let finalSceneStarted = false;
let finalSceneTime = 0;

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    // BACKGROUND ANIMATION
    starMaterial.opacity =
        0.72 + Math.sin(time * 2) * 0.2;

    moonGlow.intensity =
        80 + Math.sin(time * 1.5) * 10;

    // ======================================
    // SCENE 1: FOX WALKS THROUGH THE FOREST
    // ======================================

    if (adventureStarted) {
        adventureTime += delta;

        fox.position.z =
            foxStartZ - adventureTime * 1.4;

        foxBody.position.y =
            Math.abs(Math.sin(adventureTime * 9)) * 0.09;

        // Walking legs
        legs.forEach((leg) => {
            const phase =
                adventureTime * 9 +
                (leg.side === 1 ? Math.PI : 0) +
                (leg.frontBack === 1 ? 0 : Math.PI);

            leg.mesh.rotation.x =
                Math.sin(phase) * 0.42;
        });

        // Tail movement
        tail.rotation.x =
            -0.3 + Math.sin(adventureTime * 4) * 0.18;

        tail.rotation.y =
            Math.sin(adventureTime * 3) * 0.15;

        // Gentle head movement
        foxHead.rotation.y =
            Math.sin(adventureTime * 1.5) * 0.12;

        // Camera follows the fox
        camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            fox.position.x,
            delta * 2
        );

        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            fox.position.z + 12,
            delta * 2
        );

        camera.position.y = THREE.MathUtils.lerp(
            camera.position.y,
            5.5,
            delta * 2
        );

        camera.lookAt(
            fox.position.x,
            fox.position.y + 1.5,
            fox.position.z - 2
        );

        // End Scene 1 after 12 seconds
        if (adventureTime > 12) {
            adventureStarted = false;
            starFallStarted = true;
            starFallTime = 0;

            starGroup.position.set(
                fox.position.x + 3,
                14,
                fox.position.z - 8
            );

            starGroup.visible = true;
            playSound(magicWhoosh);
            sceneTitle.textContent =
                'Scene 2: The Falling Star ⭐';

            console.log('The falling star has appeared!');
        }
    } else {
        // Idle animation
        foxBody.position.y =
            Math.sin(time * 2) * 0.025;

        tail.rotation.x =
            -0.3 + Math.sin(time * 2) * 0.08;
    }

    // ======================================
    // SCENE 2: THE STAR FALLS
    // ======================================

    if (starFallStarted) {
        starFallTime += delta;

        const fallDuration = 5;

        if (starFallTime < fallDuration) {
            const fallProgress =
                starFallTime / fallDuration;

            // Star falls from the sky
            starGroup.position.y =
                14 - 11 * fallProgress;

            // Star spins gently
            fallingStar.rotation.y += delta * 1.5;
            fallingStar.rotation.z += delta * 0.5;

            // Golden glow
            fallingStarLight.intensity =
                30 + Math.sin(time * 8) * 12;

            // Sparkles twinkle
            sparkleMaterial.opacity =
                0.6 + Math.sin(time * 6) * 0.3;
        } else {
            // Star lands
            starGroup.position.y = 3;

            fallingStar.rotation.z =
                Math.sin(time * 2) * 0.12;

            fallingStarLight.intensity =
                35 + Math.sin(time * 3) * 8;

            starFallStarted = false;

            // Start Scene 3
            foxApproachingStar = true;
            foxApproachTime = 0;

            sceneTitle.textContent =
                'The fox notices the fallen star... ✨';

            console.log('Scene 3 has started!');
        }
    }

    // ======================================
    // SCENE 3: FOX APPROACHES THE STAR
    // ======================================

    if (foxApproachingStar) {
        foxApproachTime += delta;

        const approachDuration = 3;

        const rawProgress = Math.min(
            foxApproachTime / approachDuration,
            1
        );

        // Smoothly slow down near the star
        const progress =
            1 - Math.pow(1 - rawProgress, 3);

        const startZ = foxStartZ - 12 * 1.4;
        const targetZ = starGroup.position.z + 4;

        fox.position.z = THREE.MathUtils.lerp(
            startZ,
            targetZ,
            progress
        );

        foxBody.position.y =
            Math.abs(Math.sin(foxApproachTime * 9)) * 0.07;

        // Walking animation
        legs.forEach((leg) => {
            const phase =
                foxApproachTime * 9 +
                (leg.side === 1 ? Math.PI : 0) +
                (leg.frontBack === 1 ? 0 : Math.PI);

            leg.mesh.rotation.x =
                Math.sin(phase) * 0.35;
        });

        // Camera follows the fox
        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            fox.position.z + 12,
            delta * 2
        );

        camera.lookAt(
            fox.position.x,
            fox.position.y + 1.5,
            fox.position.z - 2
        );

        if (progress >= 1) {
            foxApproachingStar = false;

            sceneTitle.textContent =
                'The little fox has found the lost star! ✨';

            // Stop the fox's legs
            legs.forEach((leg) => {
                leg.mesh.rotation.x = 0;
            });

            // Fox reacts to the star
            foxHead.rotation.z = -0.2;
            playSound(magicChime);
            starFoundTime = time;

            // Begin Scene 4
            starReturning = true;

            // Initial magical glow
            fallingStarLight.intensity = 60;
            sparkleMaterial.opacity = 1;

            console.log('The fox has reached the star!');
        }
    }

    // ======================================
    // SCENE 4: THE STAR RETURNS TO THE SKY
    // ======================================

    if (starReturning) {
        // Slowly raise the star
        starGroup.position.y += delta * 1.2;

        // Keep the light glowing
        fallingStarLight.intensity =
            45 + Math.sin(time * 5) * 15;

        // Twinkling sparkles
        sparkleMaterial.opacity =
            0.7 + Math.sin(time * 4) * 0.3;

        // Stop at a lower height to help keep it visible
        if (starGroup.position.y >= 6) {
            starGroup.position.y = 6;

            starReturning = false;

            sceneTitle.textContent =
                'The little star is returning home! ⭐';

            console.log(
                'The star has returned to the sky!'
            );
        }
    }

    // Scene 5: The fox looks up at the star
if (
    starFoundTime > 0 &&
    !starReturning &&
    starGroup.position.y >= 6 &&
    !endingStarted
) {
    endingStarted = true;

    sceneTitle.textContent = 'A little friendship shines forever ✨';

    console.log('Scene 5: The fox looks up at the star!');

    foxHead.rotation.x = -0.3;
    foxHead.rotation.z = -0.15;

    fallingStarLight.intensity = 80;
}

    // ======================================
    // FOX REACTS TO THE MAGICAL STAR
    // ======================================

    // FOX REACTS TO THE MAGICAL STAR
if (!foxApproachingStar && starFoundTime > 0 && !endingStarted) {
    const reactionTime = time - starFoundTime;

    // Curious head movement
    foxHead.rotation.z =
        -0.2 + Math.sin(reactionTime * 2) * 0.08;

    // Pulsating golden light
    fallingStarLight.intensity =
        45 + Math.sin(reactionTime * 3) * 15;

    // Twinkling sparkles
    sparkleMaterial.opacity =
        0.7 + Math.sin(reactionTime * 4) * 0.3;
}

    // ======================================
    // SCENE 6: THE MAGICAL GOODBYE
    // ======================================

    if (endingStarted && !finalSceneStarted) {
        finalSceneStarted = true;
        finalSceneTime = 0;

        sceneTitle.textContent =
            'Even the smallest act of kindness can light up the universe ✨';

        console.log('Scene 6: The Magical Goodbye!');
    }

    if (finalSceneStarted) {
        finalSceneTime += delta;

        // Make the star glow brightly
        fallingStarLight.intensity =
            80 + Math.sin(time * 3) * 15;

        // Gently animate the fox's tail
        tail.rotation.x =
            -0.3 + Math.sin(time * 2) * 0.12;

        // Slowly pull the camera back
        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            fox.position.z + 19,
            delta * 0.35
        );

        camera.position.y = THREE.MathUtils.lerp(
            camera.position.y,
            8,
            delta * 0.35
        );

        camera.lookAt(
            0,
            3,
            fox.position.z - 4
        );

                // Finish the film after the final shot
        if (finalSceneTime >= 12) {
            forestSound.pause();
            forestSound.currentTime = 0;

            console.log('The animation has finished!');
        }
    }

    // ======================================
    // MAGICAL FIREFLIES
    // ======================================

    const positions =
        fireflyGeometry.attributes.position.array;

    for (let i = 0; i < fireflyCount; i++) {
        positions[i * 3 + 1] +=
            Math.sin(time * 1.5 + i) * 0.002;
    }

    fireflyGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

// ======================================
// 9. RESPONSIVE WINDOW
// ======================================

window.addEventListener('resize', () => {
    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// ======================================
// 10. START ADVENTURE BUTTON
// ======================================

const intro = document.getElementById('intro');
const startButton = document.getElementById('startButton');
const sceneTitle = document.getElementById('scene-title');

startButton.addEventListener('click', () => {
    intro.style.display = 'none';
    playSound(forestSound);
    // Reset Scene 1
    adventureStarted = true;
    adventureTime = 0;

    // Reset Scene 2
    starFallStarted = false;
    starFallTime = 0;

    // Reset Scene 3
    foxApproachingStar = false;
    foxApproachTime = 0;

    // Reset Scene 4
    starFoundTime = 0;
    starReturning = false;

    // Reset Scene 5
endingStarted = false;

    // Hide and reset the star
    starGroup.visible = false;
    starGroup.position.set(0, 14, -8);

    // Reset the fox
    fox.position.set(0, 0, foxStartZ);
    foxBody.position.y = 0;

    foxHead.rotation.set(0, 0, 0);

    tail.rotation.set(-0.3, 0, 0);

    legs.forEach((leg) => {
        leg.mesh.rotation.set(0, 0, 0);
    });

    // Reset camera
    camera.position.set(0, 7, 20);
    camera.lookAt(0, 3, 0);

    sceneTitle.textContent =
        'Scene 1: The Little Fox Begins Its Journey';

    console.log('The fox adventure has started!');
});