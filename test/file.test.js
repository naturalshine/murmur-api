import fs from 'fs';
import { expect, server, BASE_URL } from './setup';
describe('Files', () => {

it('inserts file', done => {
    server
        .post(`${BASE_URL}/storage/upload`)
        .attach('file',
            fs.readFileSync('/home/cst/Postman/files/deer.png'),
            'deer.png'
        ).expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
        });
    });

  it('gets files', done => {
    server
      .get(`${BASE_URL}/storage/files`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('gets hash of file in folder', done => {
    let data = [
        {
            hash: 'bafybeie5i4sht4dihc4757z3vexshxgrov3qbgeqjhedhglqihyac466cq',
            file: 'deer.wav'
        }
    ]
    server
        .post(`${BASE_URL}/storage/hash`)
        .send(data).expect(200)
        .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
        });
    });
});