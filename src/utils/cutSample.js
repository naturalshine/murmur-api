//sampling functions

import path from 'path';
import ffmpeg  from 'ffmpeg';

import { samplePath, staticPath } from '../settings'

const doCut = async(filePath, start, end, i) => {
  
    try{
        console.log("FILE PATH ", filePath);
        const fileName = path.basename(filePath);    
        const fileArr = fileName.split('.')
        const slicedName = fileArr[0]

        console.log("START ", start);
        console.log("END ", end);

        const videoFile = staticPath + slicedName + '.mp4'
        console.log("VIDEO FILE ", videoFile);

        let process = new ffmpeg(videoFile);
        
        process.then(function (spl) {
          let duration = end - start;
          console.log("DURAITON ", duration);
          spl.setVideoStartTime(start)
              .setVideoDuration(duration)
              .save(samplePath + slicedName + i.toString() + '.mp4', function (error, file) {
                if (!error){
                  console.log('sample file: ' + file);

                  let audioProcess = new ffmpeg(samplePath + slicedName + i.toString() + '.mp4');
      
                  audioProcess.then(function (spl) {
                        console.log("Converting to mp3");
                        spl.fnExtractSoundToMP3(samplePath + slicedName + i.toString() + '.mp3', function (error, file) {
                            if (!error){
                              console.log('sample audio: ' + file);
                            } else {
                              console.log("ERROR!");
                              console.log(error)
                            }
                          });

                      
              
                      }, function (error) {
                        throw new Error("Something went wrong with ffmpeg => ", error)
                      })
                      
                }else{
                  console.log("ERROR!");
                  console.log(error)
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
      const cutFile = await doCut(sample.filePath, sample.start, sample.end, sample.index);

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