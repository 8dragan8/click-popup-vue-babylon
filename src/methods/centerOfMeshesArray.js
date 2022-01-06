import {
    Vector3,
    BoundingInfo
} from "@babylonjs/core/Legacy/legacy";

export default function (array) {
    let min = array[0].getBoundingInfo().boundingBox.minimumWorld
    let max = array[0].getBoundingInfo().boundingBox.maximumWorld

    for (let i = 0; i < array.length; i++) {
        let meshMin = array[i].getBoundingInfo().boundingBox.minimumWorld
        let meshMax = array[i].getBoundingInfo().boundingBox.maximumWorld

        min = Vector3.Minimize(min, meshMin)
        max = Vector3.Maximize(max, meshMax)
    }

    return new BoundingInfo(min, max).boundingBox.centerWorld

}
