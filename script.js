const imageUpload = document.getElementById('imageUpload')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start(){
  const conatiner = document.createElement('div')
  conatiner.style.position='relative'
  document.body.append(conatiner)
  const labelFaceDesctiptors = await loadLabelImages()
  const faceMatcher = new faceapi.faceMatcher(labelFaceDesctiptors,0.6)
  document.body.append('loaded')
  imageUpload.addEventListener('change',async () => {
    const image = await faceapi.bufferToImage(imageUpload.files[0])
    conatiner.append(image)
    const canvas = faceapi.createCanvasFromMedia(image)
    conatiner.append(canvas)
    const displaySize = {width: image.width, height: image.height}
    faceapi.matchDimensions(canvas,displaySize)
    const detections = await faceapi.detectAllFaces(image)
    .withFaceLandmarks().withFaceDescriptors()
   const resizedDetectioons = faceapi.resizeResults(detections,displaySize)
   const results = resizedDetectioons.map(d=> faceMatcher.findBestMatch(d.descriptor))
   results.forEach(result, i=>{
   const box = resizedDetectioons[i].detection.box
   const drawBox = new faceapi.draw.DrawBox(box,{label:result.toString()})
   drawBox.draw(canvas)
   })
  })
}

function loadLabelImages(){
  const labels = ['Saleh','Timerlan']
  return Promise.all(
    labels.map(async label =>{
      const descriptions = []
      for (let i = 1;i<1; i++){
        const img = await faceapi.fetchImage(`C:\\Users\\App Store\\Desktop\\Face-recognation\\labeled-img\\${label}\\${i}.jpg`)
        const detections = await faceapi.detectAllFace(img)
        .withFaceLandmarks().withFaceDescriptors()
        descriptions.push(descriptions.descriptor)
      }

      return new faceapi.LabelFaceDescriptors(label,descriptions)
    })
  )
}