import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/+esm';

const viewer = document.querySelector('#modelViewer');
const viewerSection = document.querySelector('.viewer-section');
const loadingState = document.querySelector('#loadingState');
const loadingProgress = document.querySelector('#loadingProgress');
const overlayToggle = document.querySelector('#boneOverlay');
const overlayRow = document.querySelector('#overlayRow');
const modelButtons = document.querySelectorAll('.model-choice');
const scaleControl = document.querySelector('#modelScale');
const specimenCards = document.querySelectorAll('[data-specimen]');
const lightAzimuth = document.querySelector('#lightAzimuth');
const lightElevation = document.querySelector('#lightElevation');
const lightReadout = document.querySelector('#lightReadout');
const axisScaleControls = ['#scaleX', '#scaleY', '#scaleZ'].map((selector) => document.querySelector(selector));
const scaleReadout = document.querySelector('#scaleReadout');
const puzzleControls = document.querySelector('#puzzleControls');
const startPuzzleButton = document.querySelector('#startPuzzle');
const exitPuzzleButton = document.querySelector('#exitPuzzle');
const puzzleProgress = document.querySelector('#puzzleProgress');
const puzzleHud = document.querySelector('#puzzleHud');
const puzzleTimerValue = document.querySelector('#puzzleTimerValue');
const puzzleAssemblyProgress = document.querySelector('#puzzleAssemblyProgress');
const puzzleProgressValue = document.querySelector('#puzzleProgressValue');
const puzzleProgressBar = document.querySelector('#puzzleProgressBar');
const puzzleDialog = document.querySelector('#puzzleDialog');
const puzzleDialogIcon = document.querySelector('#puzzleDialogIcon');
const puzzleDialogTitle = document.querySelector('#puzzleDialogTitle');
const puzzleDialogCopy = document.querySelector('#puzzleDialogCopy');
const puzzleContinueButton = document.querySelector('#puzzleContinue');
const puzzleRetryButton = document.querySelector('#puzzleRetry');
const puzzleCelebration = document.querySelector('#puzzleCelebration');
const celebrationParticles = document.querySelector('#celebrationParticles');
const collectionPanel = document.querySelector('.collection-panel');
const mobileMenuToggle = document.querySelector('#mobileMenuToggle');
const collectionBackdrop = document.querySelector('#collectionBackdrop');
const shareStatus = document.querySelector('#shareStatus');
const shareMessage = 'Hey, I visited the DinasourLab and completed the puzzles';
const productionAuthRedirect = 'https://dinosaurlab.vercel.app/';
const authRedirectUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? window.location.origin
  : productionAuthRedirect;
const playerAccountButton = document.querySelector('#playerAccountButton');
const leaderboardFilter = document.querySelector('#leaderboardFilter');
const leaderboardList = document.querySelector('#leaderboardList');
const activePlayers = document.querySelector('#activePlayers');
const leaderboardRefresh = document.querySelector('#leaderboardRefresh');
const authModal = document.querySelector('#authModal');
const authForm = document.querySelector('#authForm');
const authClose = document.querySelector('#authClose');
const authDisplayName = document.querySelector('#authDisplayName');
const authEmail = document.querySelector('#authEmail');
const authPassword = document.querySelector('#authPassword');
const authMessage = document.querySelector('#authMessage');
const authSignUp = document.querySelector('#authSignUp');
const supabase = createClient(window.DINOSAURLAB_SUPABASE.url, window.DINOSAURLAB_SUPABASE.publishableKey);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xf2eee2, 0.017);
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
camera.position.set(7.7, 3.2, 9.4);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI * 0.88;
controls.target.set(0, 1, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x71856b, 3.1));
const lightTarget = new THREE.Object3D(); scene.add(lightTarget);
const keyLight = new THREE.DirectionalLight(0xfff1d8, 4.8); keyLight.position.set(-4, 8, 6); keyLight.target = lightTarget; keyLight.castShadow = true; scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xcfe9dc, 3.4); rimLight.position.set(7, 5, -5); scene.add(rimLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 2.4); fillLight.position.set(-7, 2, -4); scene.add(fillLight);

const ground = new THREE.Mesh(new THREE.CircleGeometry(12, 64), new THREE.ShadowMaterial({ color: 0x43513a, opacity: 0.18 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -1.62; ground.receiveShadow = true; scene.add(ground);
const grid = new THREE.GridHelper(12, 18, 0x76905e, 0xa9ad91); grid.position.y = -1.6; grid.material.transparent = true; grid.material.opacity = 0; scene.add(grid);

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const assets = { skin: null, bones: null };
const wrappers = { skin: new THREE.Group(), bones: new THREE.Group() };
wrappers.skin.visible = true; wrappers.bones.visible = false;
scene.add(wrappers.skin, wrappers.bones);
let activeModel = 'skin';
let loadedCount = 0;
let currentSpecimen = 'spinosaurus';
let loadRequest = 0;
let activeSkybox = null;
let puzzleActive = false;
let puzzleLoaded = false;
let puzzleGuide = null;
let puzzlePieces = [];
let selectedPiece = null;
let puzzleSpecimen = null;
let puzzleChallengeRunning = false;
let puzzleTimerInterval = null;
let puzzleDeadline = 0;
let currentUser = null;
let currentDisplayName = '';
let currentPuzzleRunId = null;
let startPuzzleAfterAuth = false;
const puzzleGroup = new THREE.Group();
puzzleGroup.visible = false;
scene.add(puzzleGroup);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const dragOffset = new THREE.Vector3();

const specimens = {
  spinosaurus: {
    number: 'SPECIMEN 01', name: 'SPINOSAURUS', latin: 'Spinosaurus aegyptiacus', family: 'SPINOSAURIDAE FAMILY',
    skin: 'SpinoFossil.glb', bones: 'SpinoFossil1.glb', puzzle: 'SubdividedModelSpinousarus.glb', tags: ['Theropod', 'Piscivore', 'Semi-aquatic', 'Cretaceous'],
    accent: '#4d7653', wash: '#e1ead6',
    skybox: 'ChatGPT Image 18 jul 2026, 01_09_23 p.m..png',
    age: '99–93 million years ago', timeline: 'Spinosaurus moved through wetlands and river systems of North Africa during the Late Cretaceous.',
    diet: 'An opportunistic carnivore. Its long snout and conical teeth were especially well suited to catching fish.',
    size: 'Up to 15 m long: roughly the length of a city bus. Its dorsal sail stood taller than an adult person.',
    discovery: 'The first remains were found in 1912 in Egypt’s Bahariya Oasis by Richard Markgraf.',
    visit: 'Chicago’s Field Museum displays “Sobek,” a full-scale reconstruction inspired by fossils from the Sahara.',
    visitUrl: 'https://www.fieldmuseum.org/exhibition/halls-and-galleries/spinosaurus',
  },
  tyrannosaurus: {
    number: 'SPECIMEN 02', name: 'TYRANNOSAURUS', latin: 'Tyrannosaurus rex', family: 'TYRANNOSAURIDAE FAMILY',
    skin: 'T-Rex Fossil Textured.glb', bones: 'T-Rex Fossil Skeleton.glb', puzzle: 'SubdividedModelT-Rex.glb', tags: ['Theropod', 'Carnivore', 'Terrestrial', 'Cretaceous'],
    accent: '#8a623f', wash: '#ecdcc6',
    skybox: 'ChatGPT Image 18 jul 2026, 01_20_00 p.m..png',
    age: '68–66 million years ago', timeline: 'Tyrannosaurus rex lived in western North America at the very end of the Cretaceous Period.',
    diet: 'A powerful carnivore with a deep skull, serrated teeth, and one of the strongest bites known among terrestrial animals.',
    size: 'Up to 12–13 m long: about the length of a school bus, with hips reaching roughly 3.6 m high.',
    discovery: 'The first named T. rex specimen was discovered in Montana in 1902 by fossil hunter Barnum Brown.',
    visit: 'The Field Museum in Chicago is home to SUE, one of the most complete and famous Tyrannosaurus rex skeletons.',
    visitUrl: 'https://www.fieldmuseum.org/exhibition/halls-and-galleries/sue-the-t-rex',
  },
  triceratops: {
    number: 'SPECIMEN 03', name: 'TRICERATOPS', latin: 'Triceratops horridus', family: 'CERATOPSIDAE FAMILY',
    skin: 'Triceratops Fossil Skeleton.glb', bones: 'Triceratops Fossil Textured.glb', tags: ['Ceratopsian', 'Herbivore', 'Terrestrial', 'Cretaceous'],
    puzzle: 'SubdividedModelTriceratops.glb',
    accent: '#617b69', wash: '#dce9df',
    skybox: 'ChatGPT Image 18 jul 2026, 01_12_27 p.m..png',
    age: '68–66 million years ago', timeline: 'Triceratops lived alongside Tyrannosaurus rex in the floodplains of western North America at the end of the Cretaceous.',
    diet: 'A large herbivore that used its beak and batteries of teeth to crop and process tough prehistoric plants.',
    size: 'Up to 9 m long: about the length of a large SUV, with a skull that could measure more than 2 m from beak to frill.',
    discovery: 'The first Triceratops fossils were found in North America during the late nineteenth century, in rocks now known as the Hell Creek Formation.',
    visit: 'The Smithsonian National Museum of Natural History in Washington, D.C. displays the Triceratops fossil “Hatcher” in its Deep Time hall.',
    visitUrl: 'https://naturalhistory.si.edu/exhibits/david-h-koch-hall-fossils-deep-time',
  },
  parasaurus: {
    number: 'SPECIMEN 04', name: 'PARASAURUS', latin: 'Parasaurolophus walkeri', family: 'HADROSAURIDAE FAMILY',
    skin: 'Parasaurus Fossil Textured.glb', bones: 'Parasaurus Fossil Skeleton.glb', tags: ['Hadrosaur', 'Herbivore', 'Terrestrial', 'Cretaceous'],
    puzzle: 'SubdividedModelParasaurus.glb',
    accent: '#718a51', wash: '#e3e8c8',
    skybox: 'ChatGPT Image 18 jul 2026, 01_09_23 p.m..png',
    age: '76–73 million years ago', timeline: 'Parasaurus lived in the forests and floodplains of western North America during the Late Cretaceous.',
    diet: 'A large plant-eater that used its broad beak and dense batteries of teeth to process leaves, stems, and conifers.',
    size: 'Up to 9.5 m long: about the length of a city bus, with a long curved crest rising from its skull.',
    discovery: 'The first well-known Parasaurolophus specimen was discovered in Alberta, Canada, in 1920 by the University of Toronto expedition.',
    visit: 'The Royal Ontario Museum in Toronto holds important Parasaurolophus material and offers dinosaur galleries for visitors.',
    visitUrl: 'https://www.rom.on.ca/',
  },
  pteranodon: {
    number: 'SPECIMEN 05', name: 'PTERANODON', latin: 'Pteranodon longiceps', family: 'PTERANODONTIDAE FAMILY',
    skin: 'Pteranodon Fossil Textured.glb', bones: 'Pteranodon Fossil Skeleton.glb', puzzle: 'SubdividedModelPteranodon.glb', tags: ['Pterosaur', 'Piscivore', 'Flying', 'Cretaceous'],
    accent: '#4d7882', wash: '#d9e8e7', skybox: 'ChatGPT Image 18 jul 2026, 01_20_00 p.m..png',
    age: '86-84 million years ago', timeline: 'Pteranodon soared over the inland seas of North America during the Late Cretaceous.',
    diet: 'A fish-eater that likely skimmed coastal waters and used its long toothless beak to catch prey.',
    size: 'Its wingspan could reach 7 m: about as wide as a small sailboat is long.',
    discovery: 'The first fossils were collected from the Niobrara Chalk of Kansas in the 1870s and later studied by Othniel Charles Marsh.',
    visit: 'The Sternberg Museum of Natural History in Kansas preserves important fossils from the ancient Western Interior Seaway.',
    visitUrl: 'https://sternberg.fhsu.edu/',
  },
  brachiosaurus: {
    number: 'SPECIMEN 06', name: 'BRACHIOSAURUS', latin: 'Brachiosaurus altithorax', family: 'BRACHIOSAURIDAE FAMILY',
    skin: 'Bracheosaurus Fossil Textured.glb', bones: 'Bracheosaurus Fossil Skeleton.glb', puzzle: 'SubdividedModelBracheosaurus.glb', tags: ['Sauropod', 'Herbivore', 'Terrestrial', 'Jurassic'],
    accent: '#68774a', wash: '#e4e6ca', skybox: 'ChatGPT Image 18 jul 2026, 01_09_23 p.m..png',
    age: '154-150 million years ago', timeline: 'Brachiosaurus lived in the forests and river plains of western North America during the Late Jurassic.',
    diet: 'A giant herbivore that browsed high vegetation with its long neck and broad, spoon-shaped teeth.',
    size: 'Up to 22 m long and more than 12 m tall: tall enough to look into a four-storey building.',
    discovery: 'Its first well-known remains were found in Colorado in 1900 by Elmer Riggs and his field team.',
    visit: 'Chicago’s Field Museum houses the original Brachiosaurus material collected by Elmer Riggs.',
    visitUrl: 'https://www.fieldmuseum.org/',
  },
  ankylosaurus: {
    number: 'SPECIMEN 07', name: 'ANKYLOSAURUS', latin: 'Ankylosaurus magniventris', family: 'ANKYLOSAURIDAE FAMILY',
    skin: 'Ankilosauru Fossil Textured.glb', bones: 'Ankilosauru Fossil Skeleton.glb', puzzle: 'SubdividedModelAnkilosauru.glb', tags: ['Ankylosaur', 'Herbivore', 'Armoured', 'Cretaceous'],
    accent: '#8a683f', wash: '#ecdfc5', skybox: 'ChatGPT Image 18 jul 2026, 01_12_27 p.m..png',
    age: '68-66 million years ago', timeline: 'Ankylosaurus lived in the forests and floodplains of western North America at the end of the Cretaceous.',
    diet: 'A low-growing plant eater protected by bony armour and a powerful club at the end of its tail.',
    size: 'About 6-8 m long: roughly the length of a large pickup truck, built low and wide to the ground.',
    discovery: 'The first named specimen was collected in Montana in 1906 by Barnum Brown and described two years later.',
    visit: 'The American Museum of Natural History in New York holds important Ankylosaurus fossils from its historic expeditions.',
    visitUrl: 'https://www.amnh.org/',
  },
  mammoth: {
    number: 'SPECIMEN 08', name: 'WOOLLY MAMMOTH', latin: 'Mammuthus primigenius', family: 'ELEPHANTIDAE FAMILY',
    skin: 'Mammoth Fossil Textured.glb', bones: 'Mammoth Fossil Skeleton.glb', puzzle: 'SubdiviedModelMammoth.glb', tags: ['Mammal', 'Herbivore', 'Ice Age', 'Pleistocene'],
    accent: '#5e6878', wash: '#dfe3ea', skybox: 'ChatGPT Image 18 jul 2026, 01_20_00 p.m..png',
    age: '400,000-4,000 years ago', timeline: 'Woolly mammoths lived across the cold grasslands of the Northern Hemisphere during the Ice Age.',
    diet: 'A herbivorous grazer that used its trunk and tall molars to gather grasses, sedges, and other hardy plants.',
    size: 'About 3.4 m tall at the shoulder: similar in height to a modern African elephant, with much longer curved tusks.',
    discovery: 'Mammoth remains have been recovered across Europe, Asia, and North America, often preserved in permafrost or ancient lake beds.',
    visit: 'The Mammoth Site of Hot Springs, South Dakota, is an active excavation and museum with many mammoth remains on display.',
    visitUrl: 'https://www.mammothsite.org/',
  },
};

function progressText(event, name) {
  if (!event.total) { loadingProgress.textContent = `Loading ${name}…`; return; }
  loadingProgress.textContent = `${name}: ${Math.round((event.loaded / event.total) * 100)}%`;
}

function fitObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = 7.1 / maxDimension;
  object.scale.setScalar(scale);

  // Recentrar el contenido real del GLB antes de encuadrarlo.
  box.setFromObject(object);
  const scaledCenter = box.getCenter(new THREE.Vector3());
  object.position.sub(scaledCenter);
  box.setFromObject(object);
  object.position.y += -1.58 - box.min.y;
  object.userData.baseScale = scale;
  object.updateMatrixWorld(true);
}

function frameModel(object) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const largestSide = Math.max(size.x, size.y, size.z);
  const distance = (largestSide / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) * 1.25;
  const viewDirection = new THREE.Vector3(1, 0.48, 1).normalize();

  controls.target.copy(center);
  camera.position.copy(center).addScaledVector(viewDirection, distance);
  camera.near = Math.max(distance / 100, 0.01);
  camera.far = Math.max(distance * 100, 1000);
  camera.updateProjectionMatrix();
  controls.update();
  updateLightDirection();
}

function updateLightDirection() {
  const object = (puzzleActive && puzzleGuide) ? puzzleGuide : (assets[activeModel] || assets.skin || assets.bones);
  if (!object) return;
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 2.2;
  const azimuth = THREE.MathUtils.degToRad(Number(lightAzimuth.value));
  const elevation = THREE.MathUtils.degToRad(Number(lightElevation.value));

  lightTarget.position.copy(center);
  keyLight.position.set(
    center.x + Math.cos(azimuth) * Math.cos(elevation) * radius,
    center.y + Math.sin(elevation) * radius,
    center.z + Math.sin(azimuth) * Math.cos(elevation) * radius,
  );
  lightTarget.updateMatrixWorld();
  lightReadout.textContent = `${lightAzimuth.value}° / ${lightElevation.value}°`;
}

function applyScaleToAsset(asset) {
  if (!asset) return;
  const uniform = Number(scaleControl.value) / 100;
  const [x, y, z] = axisScaleControls.map((control) => Number(control.value) / 100);
  asset.scale.set(asset.userData.baseScale * uniform * x, asset.userData.baseScale * uniform * y, asset.userData.baseScale * uniform * z);
}

function applyModelScale() {
  Object.values(assets).forEach(applyScaleToAsset);
  scaleReadout.textContent = axisScaleControls.map((control) => `${control.value}%`).join(' · ');
  if (assets[activeModel]) frameModel(assets[activeModel]);
}

function prepareModel(root, type) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = false;
    child.castShadow = type === 'skin';
    child.receiveShadow = type === 'skin';
    const oldMaterial = Array.isArray(child.material) ? child.material[0] : child.material;
    if (type === 'skin') {
      const material = oldMaterial.clone();
      material.color.set(0xffffff);
      material.metalness = 0.03;
      material.roughness = 0.68;
      material.emissive.set(0xffffff);
      material.emissiveIntensity = 0.38;
      material.side = THREE.DoubleSide;
      child.material = material;
    } else {
      child.material = new THREE.MeshStandardMaterial({
        color: 0xd7c69e, map: oldMaterial?.map || null, roughness: 0.55, metalness: 0.03,
        transparent: true, opacity: 0.82, depthWrite: false, side: THREE.DoubleSide,
      });
      child.renderOrder = 3;
    }
  });
  fitObject(root);
  return root;
}

function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      ['map', 'normalMap', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'aoMap'].forEach((key) => material[key]?.dispose());
      material.dispose();
    });
  });
}

function clearSpecimen() {
  Object.entries(wrappers).forEach(([type, wrapper]) => {
    while (wrapper.children.length) {
      const object = wrapper.children.pop();
      disposeObject(object);
    }
    assets[type] = null;
  });
}

function updateSpecimenInfo(specimen) {
  document.querySelector('#specimenNumber').textContent = specimen.number;
  document.querySelector('#specimenName').textContent = specimen.name;
  document.querySelector('#specimenLatin').textContent = specimen.latin;
  document.querySelector('#familyBadge').textContent = specimen.family;
  document.querySelector('#detailName').textContent = specimen.name[0] + specimen.name.slice(1).toLowerCase();
  document.querySelector('#detailLatin').textContent = specimen.latin;
  document.querySelector('#timelineAge').textContent = specimen.age;
  document.querySelector('#timelineCopy').textContent = specimen.timeline;
  document.querySelector('#dietCopy').textContent = specimen.diet;
  document.querySelector('#sizeCopy').textContent = specimen.size;
  document.querySelector('#discoveryCopy').textContent = specimen.discovery;
  document.querySelector('#visitCopy').textContent = specimen.visit;
  document.querySelector('#visitLink').href = specimen.visitUrl;
  document.querySelector('#speciesTags').replaceChildren(...specimen.tags.map((tag) => {
    const tagElement = document.createElement('span');
    tagElement.textContent = tag;
    return tagElement;
  }));
}

function updateSpecimenTheme(specimen) {
  document.documentElement.style.setProperty('--specimen-accent', specimen.accent || '#315d45');
  document.documentElement.style.setProperty('--specimen-wash', specimen.wash || '#e1ead4');
}

function loadSkybox(path, request) {
  textureLoader.load(path, (texture) => {
    if (request !== loadRequest) { texture.dispose(); return; }
    texture.colorSpace = THREE.SRGBColorSpace;
    if (activeSkybox) activeSkybox.dispose();
    activeSkybox = texture;
    scene.background = texture;
  }, undefined, (error) => console.warn(`Could not load skybox ${path}`, error));
}

function formatPuzzleTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function formatLeaderboardTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function setAuthMessage(message = '') { authMessage.textContent = message; }

function openAuthModal(message = 'Sign in to start a recorded puzzle run.') {
  setAuthMessage(message);
  authModal.hidden = false;
  authModal.querySelector('#authTitle').textContent = currentUser ? 'Set your player name' : 'Join the leaderboard';
  if (currentDisplayName) authDisplayName.value = currentDisplayName;
}

function closeAuthModal() { authModal.hidden = true; setAuthMessage(''); }

async function refreshCurrentProfile() {
  if (!currentUser) { currentDisplayName = ''; return; }
  const { data } = await supabase.from('profiles').select('display_name').eq('id', currentUser.id).maybeSingle();
  currentDisplayName = data?.display_name || '';
  if (currentDisplayName) authDisplayName.value = currentDisplayName;
}

function renderAccountButton() {
  playerAccountButton.textContent = currentUser
    ? (currentDisplayName ? `Player: ${currentDisplayName}` : 'Set player name')
    : 'Sign in to play';
}

async function loadLeaderboard() {
  if (!currentUser) {
    leaderboardList.innerHTML = '<li class="leaderboard-empty">Sign in to view the fastest puzzle completions.</li>';
    activePlayers.innerHTML = '<li>Sign in to see active players.</li>';
    return;
  }
  const dinosaurId = leaderboardFilter.value === 'current' ? currentSpecimen : null;
  let scoresQuery = supabase.from('puzzle_runs').select('dinosaur_id, completion_seconds, completed_at, profiles(display_name)').eq('status', 'completed').order('completion_seconds', { ascending: true }).order('completed_at', { ascending: true }).limit(10);
  if (dinosaurId) scoresQuery = scoresQuery.eq('dinosaur_id', dinosaurId);
  const activeAfter = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const activeQuery = supabase.from('puzzle_runs').select('dinosaur_id, started_at, profiles(display_name)').eq('status', 'playing').gte('started_at', activeAfter).order('started_at', { ascending: false }).limit(8);
  const [{ data: scores, error: scoreError }, { data: players, error: playerError }] = await Promise.all([scoresQuery, activeQuery]);
  if (scoreError || playerError) {
    leaderboardList.innerHTML = '<li class="leaderboard-empty">Leaderboard is temporarily unavailable.</li>';
    activePlayers.innerHTML = '<li>Unable to load active players.</li>';
    return;
  }
  leaderboardList.innerHTML = scores?.length ? scores.map((score, index) => `<li><b>${index + 1}</b><span>${escapeHtml(score.profiles?.display_name || 'Explorer')}<small>${escapeHtml(score.dinosaur_id)}</small></span><strong>${formatLeaderboardTime(score.completion_seconds)}</strong></li>`).join('') : '<li class="leaderboard-empty">No completed runs yet. Be the first!</li>';
  activePlayers.innerHTML = players?.length ? players.map((player) => `<li><span>${escapeHtml(player.profiles?.display_name || 'Explorer')}</span><small>${escapeHtml(player.dinosaur_id)}</small></li>`).join('') : '<li>No active puzzle runs right now.</li>';
}

async function startServerPuzzleRun() {
  if (!currentUser) { startPuzzleAfterAuth = true; openAuthModal(); return false; }
  const displayName = authDisplayName.value.trim().replace(/\s+/g, ' ');
  if (displayName.length < 2 || displayName.length > 24) { openAuthModal('Choose a public nickname between 2 and 24 characters before continuing.'); return false; }
  const { data, error } = await supabase.functions.invoke('puzzle-score', { body: { action: 'start', dinosaur_id: currentSpecimen, display_name: displayName } });
  if (error || !data?.run?.id) { openAuthModal(error?.message || data?.error || 'Unable to start a scored puzzle run.'); return false; }
  currentPuzzleRunId = data.run.id;
  currentDisplayName = displayName;
  renderAccountButton();
  return true;
}

async function expireServerPuzzleRun() {
  const runId = currentPuzzleRunId;
  currentPuzzleRunId = null;
  if (!runId || !currentUser) return;
  await supabase.functions.invoke('puzzle-score', { body: { action: 'expire', run_id: runId } });
  loadLeaderboard();
}

async function completeServerPuzzleRun() {
  const runId = currentPuzzleRunId;
  currentPuzzleRunId = null;
  if (!runId || !currentUser) return;
  const { data, error } = await supabase.functions.invoke('puzzle-score', { body: { action: 'complete', run_id: runId } });
  if (error || data?.error) { puzzleProgress.textContent = data?.error || 'Puzzle complete — score could not be saved.'; }
  else if (data?.run?.completion_seconds) { puzzleProgress.textContent = `Score saved: ${formatLeaderboardTime(data.run.completion_seconds)}`; }
  loadLeaderboard();
}

function clearPuzzleTimer() {
  if (puzzleTimerInterval) clearInterval(puzzleTimerInterval);
  puzzleTimerInterval = null;
  puzzleChallengeRunning = false;
}

function updatePuzzleTimer() {
  const secondsLeft = Math.max(0, Math.ceil((puzzleDeadline - Date.now()) / 1000));
  puzzleTimerValue.textContent = formatPuzzleTime(secondsLeft);
  if (secondsLeft === 0) puzzleTimeUp();
}

function showPuzzleDialog({ icon, title, copy, mode }) {
  puzzleDialogIcon.textContent = icon;
  puzzleDialogTitle.textContent = title;
  puzzleDialogCopy.textContent = copy;
  puzzleContinueButton.hidden = mode !== 'instructions';
  puzzleRetryButton.hidden = mode !== 'retry';
  puzzleDialog.hidden = false;
}

function showPuzzleInstructions() {
  clearPuzzleTimer();
  puzzleHud.hidden = true;
  const specimenName = specimens[puzzleSpecimen || currentSpecimen]?.name || 'dinosaur';
  showPuzzleDialog({
    icon: '🧩',
    title: 'Ready to assemble?',
    copy: `Drag each floating ${specimenName.toLowerCase()} piece to its matching translucent silhouette. You have 2 minutes and 30 seconds. The timer and progress bar remain visible throughout the challenge.`,
    mode: 'instructions',
  });
}

async function beginPuzzleChallenge() {
  if (!puzzleActive) return;
  if (!(await startServerPuzzleRun())) return;
  puzzleDialog.hidden = true;
  puzzleCelebration.hidden = true;
  clearPuzzleTimer();
  puzzleDeadline = Date.now() + 150 * 1000;
  puzzleChallengeRunning = true;
  puzzleHud.hidden = false;
  updatePuzzleTimer();
  puzzleTimerInterval = setInterval(updatePuzzleTimer, 250);
}

function createCelebrationParticles() {
  celebrationParticles.replaceChildren();
  const colors = ['#e2a53c', '#6b9150', '#d06a4b', '#689bb5', '#c578a1', '#f2d65d'];
  for (let index = 0; index < 54; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${4 + Math.random() * 92}%`;
    piece.style.setProperty('--confetti-color', colors[index % colors.length]);
    piece.style.setProperty('--drift', `${-180 + Math.random() * 360}px`);
    piece.style.setProperty('--fall-duration', `${2.2 + Math.random() * 1.8}s`);
    piece.style.setProperty('--fall-delay', `${Math.random() * 0.65}s`);
    celebrationParticles.appendChild(piece);
  }
  for (let index = 0; index < 8; index += 1) {
    const balloon = document.createElement('span');
    balloon.className = 'balloon';
    balloon.style.left = `${5 + index * 13}%`;
    balloon.style.setProperty('--balloon-color', colors[(index + 1) % colors.length]);
    balloon.style.setProperty('--balloon-drift', `${-70 + Math.random() * 140}px`);
    balloon.style.setProperty('--rise-duration', `${3.5 + Math.random() * 1.8}s`);
    balloon.style.setProperty('--rise-delay', `${Math.random() * 0.8}s`);
    celebrationParticles.appendChild(balloon);
  }
}

function completePuzzle() {
  if (!puzzleChallengeRunning) return;
  clearPuzzleTimer();
  createCelebrationParticles();
  puzzleCelebration.hidden = false;
  void completeServerPuzzleRun();
  setTimeout(() => { puzzleCelebration.hidden = true; }, 6500);
}

function puzzleTimeUp() {
  if (!puzzleChallengeRunning) return;
  clearPuzzleTimer();
  selectedPiece = null;
  controls.enabled = true;
  void expireServerPuzzleRun();
  puzzleHud.hidden = false;
  showPuzzleDialog({
    icon: '⏳',
    title: 'Assembly not completed',
    copy: 'Time is up. Reset the pieces and try the two-minute, 30-second challenge again.',
    mode: 'retry',
  });
}

function updatePuzzleProgress() {
  const placed = puzzlePieces.filter((piece) => piece.userData.placed).length;
  const total = puzzlePieces.length;
  const percentage = total ? Math.round((placed / total) * 100) : 0;
  puzzleProgress.textContent = placed === puzzlePieces.length && puzzlePieces.length
    ? 'Assembly complete!'
    : `${puzzlePieces.length - placed} piece${puzzlePieces.length - placed === 1 ? '' : 's'} to place`;
  puzzleProgressValue.textContent = `${placed} / ${total}`;
  puzzleProgressBar.style.width = `${percentage}%`;
  puzzleAssemblyProgress.setAttribute('aria-valuenow', String(percentage));
  if (placed === puzzlePieces.length && puzzlePieces.length) completePuzzle();
}

function scatterPuzzlePieces() {
  puzzlePieces.forEach((piece, index) => {
    const angle = (index / puzzlePieces.length) * Math.PI * 2;
    const radius = 4.8 + (index % 2) * 1.2;
    piece.position.copy(piece.userData.targetPosition).add(new THREE.Vector3(Math.cos(angle) * radius, 1.5 + (index % 3) * 1.05, Math.sin(angle) * radius * 0.65));
    piece.quaternion.copy(piece.userData.targetQuaternion);
    piece.scale.copy(piece.userData.targetScale);
    piece.userData.placed = false;
  });
  updatePuzzleProgress();
}

function clearPuzzle() {
  clearPuzzleTimer();
  selectedPiece = null;
  puzzlePieces = [];
  puzzleProgress.textContent = 'Pieces to place';
  puzzleProgressValue.textContent = '0 / 0';
  puzzleProgressBar.style.width = '0%';
  puzzleAssemblyProgress.setAttribute('aria-valuenow', '0');
  puzzleLoaded = false;
  puzzleGuide = null;
  puzzleSpecimen = null;
  while (puzzleGroup.children.length) {
    const child = puzzleGroup.children[0];
    puzzleGroup.remove(child);
    disposeObject(child);
  }
}

function createPuzzle(gltf, specimenId) {
  clearPuzzle();
  const assembly = prepareModel(gltf.scene, 'skin');
  assembly.updateMatrixWorld(true);
  puzzleGuide = assembly.clone(true);
  puzzleGuide.traverse((child) => {
    if (!child.isMesh) return;
    const material = Array.isArray(child.material) ? child.material[0] : child.material;
    child.material = material.clone();
    child.material.transparent = true;
    child.material.opacity = 0.16;
    child.material.depthWrite = false;
    child.material.color.set(0xcde2af);
  });
  puzzleGroup.add(puzzleGuide);

  const sourcePieces = [];
  assembly.traverse((child) => { if (child.isMesh) sourcePieces.push(child); });
  sourcePieces.forEach((piece) => {
    puzzleGroup.attach(piece);
    piece.userData.targetPosition = piece.position.clone();
    piece.userData.targetQuaternion = piece.quaternion.clone();
    piece.userData.targetScale = piece.scale.clone();
    piece.userData.placed = false;
    piece.castShadow = true;
    puzzlePieces.push(piece);
  });
  puzzleLoaded = true;
  puzzleSpecimen = specimenId;
  scatterPuzzlePieces();
  frameModel(puzzleGuide);
}

function exitPuzzle() {
  clearPuzzleTimer();
  puzzleActive = false;
  selectedPiece = null;
  puzzleGroup.visible = false;
  puzzleHud.hidden = true;
  puzzleDialog.hidden = true;
  puzzleCelebration.hidden = true;
  controls.enabled = true;
  wrappers.skin.visible = activeModel === 'skin';
  wrappers.bones.visible = activeModel === 'bones' || (activeModel === 'skin' && overlayToggle.checked);
  overlayRow.classList.toggle('disabled', activeModel !== 'skin');
  startPuzzleButton.hidden = false;
  exitPuzzleButton.hidden = true;
  void expireServerPuzzleRun();
  if (assets[activeModel]) frameModel(assets[activeModel]);
}

function startPuzzle() {
  const specimenId = currentSpecimen;
  const specimen = specimens[specimenId];
  if (!specimen?.puzzle) return;
  if (!currentUser) { startPuzzleAfterAuth = true; openAuthModal('Sign in before opening a puzzle so your completion can be recorded.'); return; }
  const activate = () => {
    puzzleActive = true;
    puzzleGroup.visible = true;
    wrappers.skin.visible = false;
    wrappers.bones.visible = false;
    overlayRow.classList.add('disabled');
    startPuzzleButton.hidden = true;
    exitPuzzleButton.hidden = false;
    scatterPuzzlePieces();
    frameModel(puzzleGuide);
    showPuzzleInstructions();
  };
  if (puzzleLoaded && puzzleSpecimen === specimenId) { activate(); return; }
  if (puzzleLoaded) clearPuzzle();
  loadingState.classList.remove('done');
  loadingState.querySelector('b').textContent = 'Preparing assembly puzzle';
  loadingProgress.textContent = `Separating ${specimen.name.toLowerCase()} pieces…`;
  loader.load(specimen.puzzle, (gltf) => {
    if (currentSpecimen !== specimenId) { disposeObject(gltf.scene); return; }
    createPuzzle(gltf, specimenId);
    loadingState.classList.add('done');
    activate();
  }, (event) => progressText(event, 'puzzle pieces'), (error) => failedLoad(error, specimen.puzzle));
}

function retryPuzzleChallenge() {
  if (!puzzleActive) return;
  scatterPuzzlePieces();
  frameModel(puzzleGuide);
  showPuzzleInstructions();
}

function setPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
}

function onPuzzlePointerDown(event) {
  if (!puzzleActive || !puzzleChallengeRunning) return;
  setPointer(event);
  const intersection = raycaster.intersectObjects(puzzlePieces.filter((piece) => !piece.userData.placed), false)[0];
  if (!intersection) return;
  selectedPiece = intersection.object;
  const normal = camera.getWorldDirection(new THREE.Vector3());
  dragPlane.setFromNormalAndCoplanarPoint(normal, selectedPiece.position);
  const point = raycaster.ray.intersectPlane(dragPlane, new THREE.Vector3());
  if (point) dragOffset.copy(point).sub(selectedPiece.position);
  controls.enabled = false;
  event.preventDefault();
  renderer.domElement.setPointerCapture?.(event.pointerId);
}

function onPuzzlePointerMove(event) {
  if (!puzzleActive || !selectedPiece) return;
  setPointer(event);
  const point = raycaster.ray.intersectPlane(dragPlane, new THREE.Vector3());
  if (!point) return;
  selectedPiece.position.copy(point.sub(dragOffset));
  event.preventDefault();
  updateLightDirection();
}

function onPuzzlePointerUp(event) {
  if (!selectedPiece) return;
  const piece = selectedPiece;
  if (piece.position.distanceTo(piece.userData.targetPosition) < 0.8) {
    piece.position.copy(piece.userData.targetPosition);
    piece.quaternion.copy(piece.userData.targetQuaternion);
    piece.scale.copy(piece.userData.targetScale);
    piece.userData.placed = true;
    updatePuzzleProgress();
  }
  selectedPiece = null;
  controls.enabled = true;
  renderer.domElement.releasePointerCapture?.(event.pointerId);
}

function modelLoaded(type, gltf) {
  assets[type] = prepareModel(gltf.scene, type);
  wrappers[type].add(assets[type]);
  applyScaleToAsset(assets[type]);
  if (type === 'skin') frameModel(assets[type]);
  loadedCount += 1;
  if (loadedCount === 2) {
    loadingProgress.textContent = 'Specimen ready';
    setTimeout(() => loadingState.classList.add('done'), 450);
  }
}

function loadModel(type, file, label, request) {
  loader.load(file, (gltf) => {
    if (request !== loadRequest) { disposeObject(gltf.scene); return; }
    modelLoaded(type, gltf);
  }, (event) => {
    if (request === loadRequest) progressText(event, label);
  }, (error) => {
    if (request === loadRequest) failedLoad(error, file);
  });
}

function loadSpecimen(specimenId) {
  const specimen = specimens[specimenId];
  if (!specimen) return;
  if (puzzleActive) exitPuzzle();
  if (puzzleLoaded && puzzleSpecimen !== specimenId) clearPuzzle();
  currentSpecimen = specimenId;
  puzzleControls.hidden = !specimen.puzzle;
  startPuzzleButton.textContent = specimen.puzzle ? `Assemble ${specimen.name[0] + specimen.name.slice(1).toLowerCase()}` : 'Assemble model';
  const request = ++loadRequest;
  loadedCount = 0;
  activeModel = 'skin';
  overlayToggle.checked = false;
  clearSpecimen();
  wrappers.skin.visible = true;
  wrappers.bones.visible = false;
  overlayRow.classList.remove('disabled');
  modelButtons.forEach((button) => button.classList.toggle('active', button.dataset.model === 'skin'));
  specimenCards.forEach((card) => {
    const selected = card.dataset.specimen === specimenId;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
  updateSpecimenInfo(specimen);
  updateSpecimenTheme(specimen);
  loadSkybox(specimen.skybox, request);
  loadingState.classList.remove('done');
  loadingState.querySelector('b').textContent = `Loading ${specimen.name.toLowerCase()}`;
  loadingProgress.textContent = 'Preparing the specimen…';
  loadModel('skin', specimen.skin, 'textured model', request);
  loadModel('bones', specimen.bones, 'skeletal structure', request);
}

function setCollectionDrawer(open) {
  collectionPanel.classList.toggle('mobile-open', open);
  collectionBackdrop.classList.toggle('visible', open);
  mobileMenuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('collection-drawer-open', open);
}

if (window.location.protocol === 'file:') {
  loadingState.querySelector('b').textContent = 'The model needs a local server';
  loadingProgress.textContent = 'Browsers block 3D files when index.html is opened directly.';
  document.querySelector('#fileProtocolHelp').hidden = false;
} else {
  loadSpecimen(currentSpecimen);
}

function failedLoad(error, file) {
  console.error(`Could not load ${file}`, error);
  loadingState.querySelector('b').textContent = 'Could not load the specimen';
  loadingProgress.textContent = 'Open the project from a local server and try again.';
}

function setModel(type) {
  if (puzzleActive) exitPuzzle();
  activeModel = type;
  const overlay = overlayToggle.checked;
  wrappers.skin.visible = type === 'skin';
  wrappers.bones.visible = type === 'bones' || (type === 'skin' && overlay);
  overlayRow.classList.toggle('disabled', type !== 'skin');
  modelButtons.forEach((button) => button.classList.toggle('active', button.dataset.model === type));
  if (assets[type]) frameModel(assets[type]);
}
modelButtons.forEach((button) => button.addEventListener('click', () => setModel(button.dataset.model)));
specimenCards.forEach((card) => card.addEventListener('click', () => {
  if (!card.dataset.specimen) return;
  loadSpecimen(card.dataset.specimen);
  setCollectionDrawer(false);
}));
mobileMenuToggle.addEventListener('click', () => setCollectionDrawer(!collectionPanel.classList.contains('mobile-open')));
collectionBackdrop.addEventListener('click', () => setCollectionDrawer(false));
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') setCollectionDrawer(false); });
window.matchMedia('(min-width: 941px)').addEventListener('change', (event) => { if (event.matches) setCollectionDrawer(false); });

function shareDinosaurLab(channel) {
  const pageUrl = window.location.href;
  const shareText = `${shareMessage} ${pageUrl}`;
  const popup = (url) => window.open(url, '_blank', 'noopener,noreferrer');
  if (channel === 'facebook') {
    popup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareMessage)}`);
    return;
  }
  if (channel === 'twitter') {
    popup(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`);
    return;
  }
  if (navigator.share && (channel === 'instagram' || channel === 'native')) {
    navigator.share({ title: 'DinosaurLab', text: shareMessage, url: pageUrl }).catch(() => {});
    return;
  }
  navigator.clipboard?.writeText(shareText).then(() => {
    shareStatus.textContent = channel === 'instagram' ? 'Message copied for Instagram.' : 'Share message copied.';
  }).catch(() => {
    shareStatus.textContent = 'Copy this message: ' + shareText;
  });
  if (channel === 'instagram') popup('https://www.instagram.com/');
}
document.querySelectorAll('[data-share]').forEach((button) => button.addEventListener('click', () => shareDinosaurLab(button.dataset.share)));
playerAccountButton.addEventListener('click', async () => {
  if (!currentUser) { openAuthModal(); return; }
  if (!currentDisplayName) { openAuthModal('Choose a public player name to join the leaderboard.'); return; }
  await supabase.auth.signOut();
});
leaderboardFilter.addEventListener('change', loadLeaderboard);
leaderboardRefresh.addEventListener('click', loadLeaderboard);
authClose.addEventListener('click', closeAuthModal);
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setAuthMessage('Signing in…');
  const { error } = await supabase.auth.signInWithPassword({ email: authEmail.value.trim(), password: authPassword.value });
  if (error) { setAuthMessage(error.message); return; }
  closeAuthModal();
});
authSignUp.addEventListener('click', async () => {
  setAuthMessage('Creating account…');
  const { error } = await supabase.auth.signUp({ email: authEmail.value.trim(), password: authPassword.value, options: { emailRedirectTo: authRedirectUrl } });
  setAuthMessage(error ? error.message : 'Account created. Confirm your email to return to DinosaurLab, then sign in.');
});
supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user || null;
  queueMicrotask(async () => {
    await refreshCurrentProfile();
    renderAccountButton();
    await loadLeaderboard();
    if (currentUser && startPuzzleAfterAuth) { startPuzzleAfterAuth = false; startPuzzle(); }
  });
});
overlayToggle.addEventListener('change', () => setModel(activeModel));
scaleControl.addEventListener('input', applyModelScale);
axisScaleControls.forEach((control) => control.addEventListener('input', applyModelScale));
lightAzimuth.addEventListener('input', updateLightDirection);
lightElevation.addEventListener('input', updateLightDirection);
startPuzzleButton.addEventListener('click', startPuzzle);
exitPuzzleButton.addEventListener('click', exitPuzzle);
puzzleContinueButton.addEventListener('click', beginPuzzleChallenge);
puzzleRetryButton.addEventListener('click', retryPuzzleChallenge);
renderer.domElement.addEventListener('pointerdown', onPuzzlePointerDown);
renderer.domElement.addEventListener('pointermove', onPuzzlePointerMove);
renderer.domElement.addEventListener('pointerup', onPuzzlePointerUp);
renderer.domElement.addEventListener('pointercancel', onPuzzlePointerUp);

function resetView() { if (assets[activeModel]) frameModel(assets[activeModel]); }
document.querySelector('#resetView').addEventListener('click', resetView);
document.querySelector('#focusModel').addEventListener('click', resetView);
document.querySelector('#toggleGrid').addEventListener('click', (event) => { grid.material.opacity = grid.material.opacity ? 0 : 0.32; event.currentTarget.classList.toggle('active', Boolean(grid.material.opacity)); });
document.querySelector('#fullscreenViewer').addEventListener('click', () => { if (!document.fullscreenElement) viewerSection.requestFullscreen?.(); else document.exitFullscreen?.(); });

function resize() { const { clientWidth: width, clientHeight: height } = viewer; if (!width || !height) return; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); }
new ResizeObserver(resize).observe(viewer); window.addEventListener('resize', resize); resize();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

supabase.auth.getSession().then(({ data: { session } }) => {
  currentUser = session?.user || null;
  refreshCurrentProfile().then(() => { renderAccountButton(); loadLeaderboard(); });
});
setInterval(loadLeaderboard, 30000);

window.__consoleErrors = [];
window.addEventListener('error', (event) => window.__consoleErrors.push(event.message));
window.addEventListener('unhandledrejection', (event) => window.__consoleErrors.push(String(event.reason)));
