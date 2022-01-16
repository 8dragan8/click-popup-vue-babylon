import {
  Mesh,
  MeshBuilder,
  Vector3,
  BoundingInfo,
  Color3,
  Angle,
  Vector2,
  SmartArray,
} from "@babylonjs/core/Legacy/legacy";

import findMeshCenter from "@bMethods/findMeshCenter";

export default class Window extends Mesh {
  constructor(scene, mesh) {
    super(mesh.name, scene, null, mesh);
    mesh.dispose();
    // this.parent = null;

    this.defaultMaterial = this._scene.getMaterialByName("GlassMaterial");
    this.availableMaterial = this._scene.getMaterialByName(
      "GlassAvailableMaterial"
    );

    this.material = this.defaultMaterial;
    // this._addLinesFromWorldZero();
    // this._addSphereAwayFromTheWorldCenter();
  }
  _highlightAvailable() {
    this.material = this.availableMaterial;
  }
  _resetMaterial() {
    this.material = this.defaultMaterial;
  }
  _toggleMaterials() {
    if (this.material.name == this.defaultMaterial.name) {
      this.material = this.availableMaterial;
    } else if (this.material.name == this.availableMaterial.name) {
      this.material = this.defaultMaterial;
    }
  }

  _addSphereToTheCenter() {
    let centerSphere = new MeshBuilder.CreateSphere(
      `${this.name}centerSphere`,
      { diameter: 0.5 },
      this._scene
    );
    centerSphere.position = this.meshCenter;
    centerSphere.parent = this.parent;
  }
  _addSpheres() {
    let this_vectorsWorld =
      this.refreshBoundingInfo().getBoundingInfo().boundingBox.vectorsWorld;
    console.log(
      "🚀 ~ file: window.js ~ line 50 ~ Window ~ _addSpheres ~ this_vectorsWorld",
      this_vectorsWorld
    );
    this_vectorsWorld.forEach((vector, i) => {
      let sphere = new MeshBuilder.CreateSphere(`${i}_vector`, {}, this._scene);
      sphere.position = vector;
    });
  }

  _addLinesFromWorldZero() {
    let positions = this.getFacetLocalPositions();
    let normals = this.getFacetLocalNormals();
    console.log(
      "🚀 ~ file: window.js ~ line 68 ~ Window ~ _addLinesFromWorldZero ~ normals",
      normals
    );
    let facets = this.getFacetDataParameters();
    console.log(
      "🚀 ~ file: window.js ~ line 68 ~ Window ~ _addLinesFromWorldZero ~ facets",
      facets
    );

    let lines = new SmartArray(0);
    let angles = new SmartArray(0);

    for (let i = 0; i < positions.length; i++) {
      let facetVector3 = this.getFacetPosition(i);
      let line = [
        // Vector3.Zero(),
        this.meshCenter,
        facetVector3,
        // this.getFacetPosition(i).add(this.getFacetNormal(i)),
      ];
      let point2 = new Vector2(facetVector3.x, facetVector3.z);

      lines.push(line);
      angles.push(new Angle.BetweenTwoPoints(Vector2.Zero(), point2));
    }
    console.log(
      "🚀 ~ file: window.js ~ line 81 ~ Window ~ _addLinesFromWorldZero ~ lines",
      lines
    );
    let radians = angles.data.map((a) => a.radians());
    console.log(
      "🚀 ~ file: window.js ~ line 76 ~ Window ~ _addSpheres ~ angles",
      radians,
      Math.max(...radians),
      Math.min(...radians),
      Math.max(...radians) - Math.min(...radians)
    );

    let lineSystem = MeshBuilder.CreateLineSystem(
      "ls",
      { lines: lines.data },
      this._scene
    );
    // console.log(
    //   "🚀 ~ file: window.js ~ line 83 ~ Window ~ _addSpheres ~ lineSystem.getDirection()",
    //   lineSystem.getDirection()
    // );
    lineSystem.color = Color3.Green();
  }
  _addSphereAwayFromTheWorldCenter() {
    let line = MeshBuilder.CreateLines(
      `${this.name}_line`,
      {
        points: [new Vector3.Zero(), this.meshCenter.scale(2)],
      },
      this._scene
    );
    line.parent = this.parent;
  }
  get CameraRotation() {
    return this.absoluteRotationQuaternion.toEulerAngles();
  }
  get meshCenter() {
    let minAndMax = this.getHierarchyBoundingVectors(true, false);
    return new BoundingInfo(minAndMax.min, minAndMax.max).boundingBox
      .centerWorld;
    // return findMeshCenter(this);
  }
}
