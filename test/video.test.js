import { expect, server, BASE_URL } from './setup';

describe('Videos', () => {


    it('inserts video', done => {
    
        const data = { 
          title: 'Claire', 
          description: 'video description', 
          image: '',
          video: '',
          audio: '',
          file: 'deer',
          path: '/home/cst/code/murmur/murmur-api/src/resources/static/assets/uploads/',
          authorship: [{
              created_by: [
                  {
                      primary_artist: 'Claire Tolan',
                      collaborators: ['CST', 'Chez Shhh']
                  }
              ],
              written_by: [
                  {
                      primary_artist: 'Claire Tolan',
                      collaborators: ['CST', 'Chez Shhh']
                  }
              ]
          }],
          published: true, 
          duration: '3.01',
          play_count: 0,
          keywords: [{
              keywords: ['cool', 'video', 'shhh', 'role play']}],
          asmr_sounds: [{
              asmr_sounds: ['crinkling', 'scratching', 'whispering']
          }],
          lyrics: 'suck it losers'
      };    
      server
        .post(`${BASE_URL}/media/videos`)
        .send(data)
        .expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.instanceOf(Object);
        expect(res.body.message[0]).to.have.property('id');
        expect(res.body.message[0]).to.have.property('title', data.title);
        expect(res.body.message[0]).to.have.property('description', data.description);
        done();
      });
    });

  it('get all videos', done => {
    server
      .get(`${BASE_URL}/media/videos`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.messages).to.be.instanceOf(Array);
        res.body.messages.forEach(m => {
          expect(m).to.have.property('id');
          expect(m).to.have.property('title');
          expect(m).to.have.property('description');
        });
        done();
      });
  });

  it('gets single videos', done => {
    server
      .get(`${BASE_URL}/media/videos?id=1`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.messages).to.be.instanceOf(Object);
        res.body.messages.forEach(m => {
          expect(m).to.have.property('id');
          expect(m).to.have.property('title');
          expect(m).to.have.property('description');
        });
        done();
      });
  });
  /*
  it('creates tableland video table', done => {
    const tData = {
            'id' : 'integer primary key',
            'name': 'text', 
            'description': 'text', 
            'video': 'text', 
            'audio': 'text',
            'image': 'text', 
            'attributes': 'text'
          };
    server
        .post(`${BASE_URL}/media/videos/tableland/create`)
        .send(tData)
        .expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
        });
    }).timeout(100000);*/
  /*
  it('creates web3 video', done => {
      const data = { 
        title: 'Claire the sixth', 
        description: 'video description', 
        image: '',
        video: '',
        audio: '',
        file: 'deer',
        path: '/home/cst/code/murmur/murmur-api/src/resources/static/assets/uploads/',
        authorship: [{
            created_by: [
                {
                    primary_artist: 'Claire Tolan',
                    collaborators: ['CST', 'Chez Shhh']
                }
            ],
            written_by: [
                {
                    primary_artist: 'Claire Tolan',
                    collaborators: ['CST', 'Chez Shhh']
                }
            ]
        }],
        published: true, 
        duration: '3.01',
        play_count: 0,
        keywords: [{
            keywords: ['cool', 'video', 'shhh', 'role play']}],
        asmr_sounds: [{
            asmr_sounds: ['crinkling', 'scratching', 'whispering']
        }],
        lyrics: 'suck it losers'
    };    
    server
        .post(`${BASE_URL}/media/videos/nft`)
        .send(data)
        .expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message[0]).to.be.instanceOf(Object);
        expect(res.body.message[0]).to.have.property('id');
        expect(res.body.message[0]).to.have.property('title', data.title);
        expect(res.body.message[0]).to.have.property('description', data.description);
        done();
        });
    }).timeout(100000);
    */

});