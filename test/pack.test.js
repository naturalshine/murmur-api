import { expect, server, BASE_URL } from './setup';

describe('Packs', () => {


    it('inserts pack', done => {

        const data = { 
            title: 'Claire', 
            description: 'pack description', 
            image: '',
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
            edition_size: 30,
            published: true, 
            keywords: [{
                keywords: ['cool', 'pack', 'shhh', 'role play']}],
            asmr_sounds: [{
                asmr_sounds: ['crinkling', 'scratching', 'whispering']
            }],
        };    
      server
        .post(`${BASE_URL}/media/packs`)
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

  it('gets all packs', done => {
    server
      .get(`${BASE_URL}/media/packs`)
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

  it('gets single pack', done => {
    server
      .get(`${BASE_URL}/media/packs?id=1`)
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
  it('creates tableland pack table', done => {
    const tData = {
            'id' : 'integer primary key',
            'name': 'text', 
            'description': 'text', 
            'image': 'text', 
            'decimals': 'int',
            'price': 'int',
            'attributes': 'text'
          };
    server
        .post(`${BASE_URL}/media/packs/tableland/create`)
        .send(tData)
        .expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
        });
    }).timeout(100000);
*/
    /*
  it('creates web3 pack', done => {

    const data = { 
        title: 'Claire', 
        description: 'pack description', 
        image: '',
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
        edition_size: 30,
        published: true, 
        keywords: [{
            keywords: ['cool', 'pack', 'shhh', 'role play']}],
        asmr_sounds: [{
            asmr_sounds: ['crinkling', 'scratching', 'whispering']
        }],
    };  
    server
        .post(`${BASE_URL}/media/packs/nft`)
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