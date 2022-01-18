import {
  Mesh,
  MeshBuilder,
  Vector3,
  BoundingInfo,
  Color3,
  Angle,
  Vector2,
  SmartArray,
  Plane,
  VertexBuffer,
  Scalar,
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

    this._centerSphere = null;
    this.material = this.defaultMaterial;
    // this._calculateNormals();
    this._addSphereToTheCenter();
    // this._addLinesFromWorldZero();
    // this.createSurfaceSpheres();
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
    this._centerSphere = new MeshBuilder.CreateSphere(
      `${this.name}centerSphere`,
      { diameter: 0.5 },
      this._scene
    );
    this._centerSphere.position = this.meshCenter;
    // centerSphere.parent = this.parent;
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

  _calculateNormals() {
    let positions = this.getFacetLocalPositions();
    console.log(
      "🚀 ~ file: window.js ~ line 67 ~ Window ~ _calculateNormals ~ positions",
      positions
    );
    let normals = this.getFacetLocalNormals();
    console.log(
      "🚀 ~ file: window.js ~ line 69 ~ Window ~ _calculateNormals ~ normals",
      normals
    );
    let parameters = this.getFacetDataParameters();
    console.log(
      "🚀 ~ file: window.js ~ line 71 ~ Window ~ _calculateNormals ~ parameters",
      parameters
    );

    let planeForFirstFacet = new Plane.FromPoints(
      this.getFacetPosition(0),
      this.getFacetPosition(2),
      this.getFacetPosition(5)
    );
    new MeshBuilder.CreatePlane(
      `pl_${this.name}`,
      {
        sourcePlane: planeForFirstFacet,
        sideOrientation: Mesh.FRONTSIDE,
      },
      this._scene
    );
  }
  _addLinesFromWorldZero() {
    let positions = this.getFacetLocalPositions();
    let normals = this.getFacetLocalNormals();
    let getIndices = this.getIndices();
    // console.log(
    //   "🚀 ~ file: window.js ~ line 102 ~ Window ~ _addLinesFromWorldZero ~ getIndices",
    //   getIndices
    // );
    // console.log(
    //   "🚀 ~ file: window.js ~ line 68 ~ Window ~ _addLinesFromWorldZero ~ normals",
    //   normals
    // );
    let facets = this.getFacetDataParameters();
    // console.log(
    //   "🚀 ~ file: window.js ~ line 68 ~ Window ~ _addLinesFromWorldZero ~ facets",
    //   facets
    // );

    let lines = new SmartArray(0);
    let angles = new SmartArray(0);

    for (let i = 0; i < positions.length; i++) {
      let facetVector3 = this.getFacetPosition(i);
      let facetNormal3 = this.getFacetPosition(i).add(
        this.getFacetNormal(i).scale(0.01)
      );
      let line = [
        // Vector3.Zero(),
        this.meshCenter,
        facetVector3,
        // facetNormal3,
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
      // radians,
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
  _addLineAwayFromTheWorldCenter() {
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

  createSurfaceSpheres() {
    let density = 150;
    let points = this.createSurfacePoints(density);
    console.log(
      "🚀 ~ file: window.js ~ line 181 ~ Window ~ createSurfaceSpheres ~ points",
      points
    );

    let sphere = MeshBuilder.CreateSphere(
      "point",
      { diameter: 0.05, segments: 6 },
      this._scene
    );
    // sphere.position = points.points[0]; //place base sphere on surface
    // let wMatr = this.getWorldMatrix();
    // for (let p = 0; p < points.points.length; p++) {
    //   let dot = sphere.createInstance("");
    //   // dot.parent = this.parent;
    //   dot.position = new Vector3.TransformCoordinates(points.points[p], wMatr);
    // }
  }
  createSurfacePoints() {
    let positions = this.getVerticesData(VertexBuffer.PositionKind);
    let indices = this.getIndices();

    let points = [];
    let props = [];

    for (let index = 0; index < indices.length / 3; index++) {
      let id0 = indices[3 * index];
      let id1 = indices[3 * index + 1];
      let id2 = indices[3 * index + 2];
      let v0X = positions[3 * id0];
      let v0Y = positions[3 * id0 + 1];
      let v0Z = positions[3 * id0 + 2];
      let v1X = positions[3 * id1];
      let v1Y = positions[3 * id1 + 1];
      let v1Z = positions[3 * id1 + 2];
      let v2X = positions[3 * id2];
      let v2Y = positions[3 * id2 + 1];
      let v2Z = positions[3 * id2 + 2];

      let vertex0 = new Vector3(v0X, v0Y, v0Z);
      let vertex1 = new Vector3(v1X, v1Y, v1Z);
      let vertex2 = new Vector3(v2X, v2Y, v2Z);

      let vec0 = vertex1.subtract(vertex0);
      let vec1 = vertex2.subtract(vertex1);
      let vec2 = vertex2.subtract(vertex0);
      let a = vec0.length();
      let b = vec1.length();
      let c = vec2.length();
      let p = (a + b + c) / 2;
      let area = Math.sqrt(p * (p - a) * (p - b) * (p - c));
      props.push({
        vertex: { vertex0, vertex1, vertex2 },
        vec: { vec0, vec1, vec2 },
        area,
        a,
        b,
        c,
        p,
      });

      points.push(vertex0);
      points.push(vertex1);
      points.push(vertex2);
    }
    return { points, props };
  }
}
