export default function handleResize() {
    console.log('resized');
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}