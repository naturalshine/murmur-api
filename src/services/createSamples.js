import path from 'path';
import ffmpeg  from 'ffmpeg';

import { samplePath } from '../settings'

export const cutSamples = async (data)=> {
    console.log("CUTTING SAMPLES => ", data);
      // data.paths
      /**
       * [{
      *    filePath: "/path/on/server",
      *    start: 420 // time in seconds
      *    end: 666
      *  }]
      * */

    try {
      let finalFiles = []
      for (sample in data.paths){
        const fileName = path.basename(sample.filePath);

        let process = new ffmpeg(sample.filePath);
        
        process.then(function (spl) {
            let duration = sample.end - sample.start;
            console.log("DURATION => ", duration);
            spl.setVideoStartTime(sample.start)
                .setVideoDuration(duration)
                .save(samplePath + fileName, function (error, file) {
                  if (!error)
                    console.log('sample file: ' + file);
                    finalFiles.push(file);
                });
        }, function (err) {
          throw new Error("Something went wrong with ffmpeg => ", err)
        });
      }

      return { 
          success: true, 
          message: finalFiles
        };
      } catch (err) {
        console.log("error :", err);

        return { 
            success: false, 
            message: err 
        };
      }
}