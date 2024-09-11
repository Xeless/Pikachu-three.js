import './style.css';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajouter une lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Lumière ambiante plus intense
scene.add(ambientLight);

// Ajouter une lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Lumière directionnelle plus intense
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Ajouter une lumière ponctuelle
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Intensité de 1, portée de 100
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Fonction pour charger un modèle FBX et l'ajouter à la scène
function loadModel(path) {
  const loader = new FBXLoader();
  loader.load(
    path,
    (object) => {
      scene.add(object);

      // Ajuster les positions et échelles
      const scale = 0.5; // Réduire l'échelle à 50%
      object.scale.set(scale, scale, scale);

      // Calculer la taille du modèle pour ajuster la position de la caméra
      const boundingBox = new THREE.Box3().setFromObject(object);
      const size = boundingBox.getSize(new THREE.Vector3());
      console.log('Taille du modèle', size); // Afficher la taille du modèle

      // Ajuster la position de la caméra en fonction de la taille du modèle
      camera.position.set(0, size.y / 2, size.z * 2); // Ajuster en fonction de la taille du modèle
      camera.lookAt(0, size.y / 2, 0); // Assurer que la caméra regarde vers le centre du modèle
    },
    undefined,
    (error) => {
      console.error(`Erreur de chargement du modèle ${path}`, error);
    }
  );
}

// Charger le modèle FBX
loadModel('./models/Pikachu.fbx');

// Fonction d'animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Lancer l'animation
animate();

// Redimensionner le canvas au changement de taille de fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
