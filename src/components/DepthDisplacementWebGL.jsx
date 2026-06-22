import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

// VERTEX SHADER: We physically deform the 3D mesh based on the depth map!
const vertexShader = `
  uniform sampler2D uDepth;
  uniform float uDepthScale;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    // Read depth map (white = 1.0, black = 0.0)
    float depth = texture2D(uDepth, vUv).r;
    
    // Smooth the depth curve gently instead of a hard step to prevent jagged 3D extrusions
    depth = pow(depth, 1.2);

    vec3 pos = position;
    // Push vertices outwards along the Z-axis to create a 3D bas-relief!
    pos.z += depth * uDepthScale;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// FRAGMENT SHADER: Just render the image normally onto the 3D mesh
const fragmentShader = `
  uniform sampler2D uImage;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uImage, vUv);
    gl_FragColor = color;
  }
`;

const DepthDisplacementWebGL = forwardRef(({ 
  imageSrc, 
  depthSrc, 
  className = "",
  style = {}
}, ref) => {
  const mountRef = useRef(null);
  const stateRef = useRef({
    targetMouse: new THREE.Vector2(0, 0),
    active: 0
  });

  useImperativeHandle(ref, () => ({
    updateMouse: (x, y, active) => {
      // x and y are -1 to 1
      stateRef.current.targetMouse.set(x, y);
      stateRef.current.active = active;
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    
    // Use PerspectiveCamera so we can actually see the 3D rotation perspective!
    const camera = new THREE.PerspectiveCamera(30, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    // Position camera so a 2x2 plane fills the view. 
    // At fov=30, height=2, distance = 1 / Math.tan(15 * Math.PI / 180) ≈ 3.73
    camera.position.z = 3.73;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const imgTexture = textureLoader.load(imageSrc);
    const depthTexture = textureLoader.load(depthSrc);
    
    imgTexture.minFilter = THREE.LinearFilter;
    depthTexture.minFilter = THREE.LinearFilter;

    const uniforms = {
      uImage: { value: imgTexture },
      uDepth: { value: depthTexture },
      uDepthScale: { value: 0.18 } // Extrude depth physically (increased for more 3D pop)
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.FrontSide
    });

    // Ensure plane aspect ratio matches the image (via the container)
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    // Ultra-high segment count (256x256) to completely eliminate geometry jaggedness!
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2, 256, 256);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId;
    const currentMouse = new THREE.Vector2(0, 0);

    const render = () => {
      currentMouse.lerp(stateRef.current.targetMouse, 0.08);
      const activeMult = stateRef.current.active;
      
      // ROTATE THE ENTIRE MESH based on mouse!
      // This is true 3D rotation of a 3D deformed plane, ZERO UV tearing.
      mesh.rotation.y = currentMouse.x * activeMult * -0.32; // Turn head towards mouse (amplitude increased)
      mesh.rotation.x = currentMouse.y * activeMult * -0.22; // Tilt head up/down (amplitude increased)
      
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      imgTexture.dispose();
      depthTexture.dispose();
    };
  }, [imageSrc, depthSrc]);

  return (
    <div 
      ref={mountRef} 
      className={className} 
      style={style} 
    />
  );
});

export default DepthDisplacementWebGL;
