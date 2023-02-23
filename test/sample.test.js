import { expect, server, BASE_URL } from './setup';

describe('Samples', () => {


    it('inserts sample', done => {

      const data = { 
            title: 'Claire', 
            description: 'sample description', 
            image: '',
            audio: '',
            video_id: 1,
            pack_id: 1,
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
            start_time: '2.00',
            end_time: '1.00',
            keywords: [{
                keywords: ['cool', 'sample', 'shhh', 'role play']}],
            asmr_sounds: [{
                asmr_sounds: ['crinkling', 'scratching', 'whispering']
            }],
            loop: true,
            lyrics: 'suck it losers'
          };    
      server
        .post(`${BASE_URL}/media/samples`)
        .send(data)
        .expect(201)
        .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.be.instanceOf(Object);
        expect(res.body.message[0]).to.have.property('id');
        expect(res.body.message[0]).to.have.property('title', data.title);
        expect(res.body.message[0]).to.have.property('description', data.description);
        done();
      });
    });

  it('gets all samples', done => {
    server
      .get(`${BASE_URL}/media/samples`)
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

  it('gets single sample', done => {
    server
      .get(`${BASE_URL}/media/samples?id=1`)
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
  it('creates tableland sample table', done => {
    const tData = {
            'id' : 'integer primary key',
            'name': 'text', 
            'description': 'text', 
            'audio': 'text',
            'image': 'text', 
            'decimals': 'int',
            'sample_pack': 'text',
            'video': 'text',
            'attributes': 'text'
          };
    server
        .post(`${BASE_URL}/media/samples/tableland/create`)
        .send(tData)
        .expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
        });
    }).timeout(100000);*/
  /*
  it('creates web3 sample', done => {
    const data = { 
      title: 'Claire two', 
      description: 'sample description', 
      image: '',
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
      start_time: '2.00',
      end_time: '1.00',
      keywords: [{
          keywords: ['cool', 'sample', 'shhh', 'role play']}],
      asmr_sounds: [{
          asmr_sounds: ['crinkling', 'scratching', 'whispering']
      }],
      loop: true,
      lyrics: 'suck it losers'
    };    
    server
        .post(`${BASE_URL}/media/samples/nft`)
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