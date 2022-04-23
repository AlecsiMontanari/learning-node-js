var request = require('request');

describe('get messages', ()=>{
    it('should return 200 OK',(done)=>{
        request.get('http://localhost:3000/messages', (err, res)=>{
            expect(res.statusCode).toBe(200);
            done();
        })
    })
    it('should return a list that is not empty',(done)=>{
        request.get('http://localhost:3000/messages', (err, res)=>{
            expect(JSON.parse(res.body).length).toBeGreaterThan(0);
            done();
        })
    })
})

describe('get messages from user', ()=>{
    it('should return 200 OK',(done)=>{
        request.get('http://localhost:3000/messages/Alecsi', (err, res)=>{
            expect(res.statusCode).toBe(200);
            done();
        })
    })
    it('the name should be Alecsi', (done)=>{
        request.get('http://localhost:3000/messages/Alecsi', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toBe('Alecsi')
            done();
        })
    })
})