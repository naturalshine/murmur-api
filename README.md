# MURMUR API

## API PATTERNS

### VIDEO

#### CREATE & UPLOAD: 
1. FE: Name video with random id + user wallet
2. API: Upload video and return file name (should be same)
3. FE: me audio file same name as video 
4. API: Upload audio file 
5. FE: Name static image with same name as video
6. API: Upload image
7. FE: Insert names / locations / urls into metadata
8. API: Write metadata to server

TODO: 
11. API: Mint NFT (Goerli)

#### Access (FE)
1. MONDAY: API endpoint: Fetch all videos on load (id, name, image, web3 video url, web3 audio url)
2. FE: Select video to play
3. FE: LivePeer video url 
4. FE: Audio in state 
5. FE: Select audio clipping mode
6. FE: etch audio file from web3.storage

## SAMPLES AND SAMPLE PACKS
1. API: log requests to cut file in ffmpeg format
3. API: cut file
8. API: samples update fkeys to sample pack
9. API: mint sample pack endpoint request
14. API: mint polygon tokens 
15. API: save token ids to database
16. API: return sample pack & samples (playable) to frontend

### FRONT END LOG
FE: VIDEO
- Create video
- View all videos
- Select video
- Play video

FE: SAMPLES
- request audio
- clip audio
- submit clips
- view all clips
- group clips into sample pack
- save sample pack
- view all sample packs
- mint sample pack 
- view minted sample pack








