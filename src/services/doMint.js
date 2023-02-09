export const doMint = (req, res)=> {
    console.log("ok")
    try {
        res.status(200).json({ messages: "mint" });
      } catch (err) {
        res.status(200).json({ messages: err.stack });
      }
}