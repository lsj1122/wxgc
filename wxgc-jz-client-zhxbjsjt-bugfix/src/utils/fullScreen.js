export default function () {
    //切换全屏
    if (document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen) {
        let exitFullScre = document.exitFullscreen||document.mozCancelFullScreen||document.webkitCancelFullScreen||document.msExitFullscreen
        exitFullScre.call(document)
    } else {
        let el = document.documentElement;
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;      
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        }
    }
    return
}