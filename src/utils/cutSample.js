import path from 'path';
import ffmpeg  from 'ffmpeg';

import { samplePath } from '../settings'

const doCut = async(filePath, start, end) => {
  
    try{
        const fileName = path.basename(filePath);    
        const fileArr = fileName.split('.')
        const slicedName = fileArr[0]

        let process = new ffmpeg(filePath);
        
        process.then(function (spl) {
          let duration = end - start;
          spl.setVideoStartTime(start)
              .setVideoDuration(duration)
              .save(samplePath + slicedName + '.mp4', function (error, file) {
                if (!error){
                  console.log('sample file: ' + file);

                  let audioProcess = new ffmpeg(samplePath + slicedName + '.mp4');
      
                  audioProcess.then(function (spl) {
                        spl.fnExtractSoundToMP3(samplePath + slicedName + '.mp3', function (error, file) {
                            if (!error){
                              console.log('sample audio: ' + file);
                            }
                          });
              
                      }, function (err) {
                        throw new Error("Something went wrong with ffmpeg => ", err)
                      })
                      
                }
              })

        }, function (err) {
          throw new Error("Something went wrong with ffmpeg => ", err)
        })
        
        return process;

    } catch(err){
      console.log(err);
    }


}

export const cutSample = async (sample)=> {
    console.log("CUTTING SAMPLE => ", sample.filePath);
      // data.paths
      /**
       * {
      *    filePath: "/path/on/server",
      *    start: 420 // time in seconds
      *    end: 666
      *  }
      * */

    try {

      console.log("Cut Sample... ");
      const cutFile = await doCut(sample.filePath, sample.start, sample.end);

      console.log(cutFile.file_path);

      return { 
          success: true, 
          message: "Done cutting"
        };
      } catch (err) {
        console.log("error :", err);

        return { 
            success: false, 
            message: err 
        };
      }
}