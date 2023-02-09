export const doClipAudio = (req, res)=> {
    console.log("ok")
    try {
        res.status(200).json({ messages: "ok" });
      } catch (err) {
        res.status(200).json({ messages: err.stack });
      }
}