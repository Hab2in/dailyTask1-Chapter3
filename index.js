// import atau memanggil package yang kita mau pake di aplikasi kita
const express = require('express');
const fs = require("fs");

const app = express();
const PORT = 4000;

app.use(express.json());

// // proses baca file json nya dengan FS module, dan json nya dibantu dibaca dengan JSON.parse
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))



// 1) bikin proses put/edit data sukses sampai data nya teredit di file json nya
app.put('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex(el => el.id === id);
    if (personIndex !== -1) {
        persons[personIndex] = { ...persons[personIndex], ...req.body };
        res.status(200).json({
            status: 'success',
            message: `Data dengan id ${id} berhasil diubah`,
            data: persons[personIndex]
        });
    } else { 
        res.status(404).json({
            status: 'fail',
            message: `Data dengan id ${id} tidak ditemukan`
        });return
    }
    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
                status: "success",
                message: `data dari id ${id} berhasil berubah`
            })
        }
    )
});




// 2) bikin validasi jika id tidak ditemukan dari params id nya di api get data by id, delete dan put 
// >>>>GET<<<<
app.get('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const person = persons.find(el => el.id === id);

    if (!person) {
        return res.status(404).json({
            status: "fail",
            message: "Data tidak ditemukan"
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            person
        }
    });
});

//>>>>DELETE<<<<
app.delete('/person/:id', (req,res) => {
    const id = req.params.id * 1;

    const index = persons.findIndex(element => element.id === id);
    const person = persons.find(el => el.id === id);

    if (!person){
        res.status(400).json({
            status: 'failed',
            message: `peson dengan id ${id} tersebut invali/tidak ada`
        })
    }

    if (index !== -1) {
        persons.splice(index, 1);
    }

    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
                status: 'success',
                message: `data dari id ${id} nya berhasil dihapus`
            })
        }
    )
})

// >>>PUT (sudah ada di nomer 1)<<<


// 3) bikin validasi di create/edit API utk request body

app.post('/person', (req, res) => {
    const newId = persons.length - 1 + 10;
    const newPerson = Object.assign({ id: newId }, req.body)
    const personName = persons.find(el => el.name === req.body.name);
    const cukupUmur = req.body.age < 17
    
    if(personName) {
        res.status(400).json({
            status: 'failed',
            message: `nama ${req.body.name} already exists`
        })
    } else if (cukupUmur) {
        res.status(400).json({
            status: 'failed',
            message: `${req.body.name} belum cukup umur`
        })
    } else {
        persons.push(newPerson);
        fs.writeFile(
            `${__dirname}/person.json`,
            JSON.stringify(persons),
            errr => {
                res.status(201).json({
                    status: 'success',
                    message: 'data berhasil ditambahkan',
                    data: {
                        person: newPerson
                    }
                })
            })
        }
})

// memulai servernya
app.listen(PORT, () => {
console.log(`App running on Localhost: ${PORT}`)
})
