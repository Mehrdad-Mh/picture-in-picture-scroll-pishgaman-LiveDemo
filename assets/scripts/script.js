function isVideoPlaying(videoElement) {
    return videoElement.currentTime > 0 && !videoElement.paused &&
    !videoElement.ended && videoElement.readyState > 2
}

const featurs = {
    root : null ,
    rootMargin : '0px'
}

async function onIntersection(videoEntries){

    for (let videoEntry of videoEntries) {

        if(videoEntry.isIntersecting) {

            videoEntry.target.isLeaving = true

            if(videoEntry.target.PIP) {

                await document.exitPictureInPicture().catch((err) => {
                    console.log(err , 'err in exiting picture')
                })
                videoEntry.target.PIP = false
                videoEntry.target.isLeaving = true
                // videoEntry.target.pause()
            }
        }else if(videoEntry.target.isLeaving) {

            videoEntry.target.isLeaving = false

             if( isVideoPlaying (videoEntry.target)) {

               var event = new MouseEvent('click' , {
                view: window,
                bubbles:true,
                cancelable:true
               })

               videoEntry.target.PIP = true
               videoEntry.target.dispatchEvent(event)

               setTimeout(async () => {
                await videoEntry.target.requestPictureInPicture()
               }, 50)
             }

        }
    }
}

let watcher = new IntersectionObserver(onIntersection , featurs)

let videoElements = [...document.querySelectorAll('video')]

videoElements.forEach(videoElement => 
    watcher.observe(videoElement))