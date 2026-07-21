const express = require('express');
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./CAI_DB.db');

  // usa la cartella public
  app.use(express.static('public'));

  // indica al server di usare il servizio json
  app.use(express.json());

    // CHECK SE ESISTONO PROGETTI
  app.get(
    '/api/check_progetti', (req, res) => {
      db.get (
        'SELECT 1 FROM CAI_Progetti LIMIT 1', [],
        function(err,row) {
          console.log('ROW:', row);
          if (err) {return res.status(500).json(err);}
          res.json({
            hasData: !!row
          });
    });
  });

    //////////////// API PER LETTURA

      //  OTTIENI TUTTI I PROGETTI
  app.get(
    '/api/get_progetti', (req, res) => {
      db.all('SELECT id, nome FROM CAI_Progetti WHERE ind_canc = 0', [],
        function(err,rows) {
          if (err) {return res.status(500).json(err);}
          res.json(rows);
        });
      }         
  );


    // OTTIENI TUTTE LE CONVERSAZIONI IN BASE ALL'ID PROGETTO
  app.post(
    '/api/get_conversazioni', (req, res) => {
      db.all('SELECT c.id, c.topic, c.descrizione FROM CAI_Conversazioni c JOIN CAI_progXconv pc ON c.id = pc.conv_id WHERE pc.prog_id = ? AND c.ind_canc = 0',
      [req.body.prog_id],
      function(err, rows) {
        if (err) {return res.status(500).json(err);}
          res.json(rows);
      });
    }
  );
    
    // OTTIENI I MESSAGGI IN BASE A ID CONVERSAZIONE
  app.post(
    '/api/getMessaggi', (req, res) => {
      db.all('SELECT m.id, m.ruolo_id, m.testo, m.data_invio FROM CAI_Messaggi m JOIN CAI_convXmess cm ON cm.mess_id = m.id WHERE cm.conv_id = ?',
      [req.body.conv_id],
      function (err, rows) {
        if (err) {
          console.log(err);
          console.log(err.message);
        }
          res.json(rows);
      });
    }
  );

// OTTIENI I MESSAGGI DI RISPOSTA DALL'ASSISTENTE
  app.get(
    '/api/getResponse', (req, res) => {
      db.get('SELECT * FROM CAI_Messaggi_simulati WHERE id = ?',
        [req.body.id],
        function(err,row) {
          if (err) {
          console.log(err);
          console.log(err.message);
          }
        res.json(row);
        });
  });


//// API PER SCRITTURA

    // NUOVA CONVERSAZIONE
    app.post(
      '/api/newConversation', (req, res) => {
        db.run('INSERT INTO CAI_Conversazioni(topic, descrizione, data_creazione, ind_canc) VALUES (?,?,?,?)',
        [req.body.topic, req.body.descrizione, Date.now(), 0],
        function(err) {
          if (err) {
            console.log("Entrato nella callback della seconda run");
            return res.status(500).json({
              code: err.code,
              message: "problema nell'inserimento di dati in CAI_Conversazioni"
            });
          }

          const id_conv = this.lastID;

          db.run('INSERT INTO CAI_progXconv(prog_id, conv_id) VALUES (?, ?)',
            [req.body.prog_id, id_conv],
            function(err) {
                if (err) {
                  return res.status(500).json({
                    code: err.code,
                    message: "problema nell'inserimento di dati in CAI_Conversazioni"
                  });
                }
                res.json({
                success: true,
                conv_id: id_conv
                })
          });
        }
      )}
    );

        // NUOVO PROGETTO
    app.post(
      '/api/newProject', (req, res) => {
        db.run('INSERT INTO CAI_Progetti(nome, descrizione, ind_canc) VALUES (?,?,?)',
        [req.body.proj_name, req.body.proj_descrizione, 0],
        function(err) {
          if (err) {
            return res.status(500).json({
              code: err.code,
              message: "problema nell'inserimento di dati in CAI_Progetti"
            });
          }
        }
    )}
    );


    // INVIO MESSAGGIO CHAT
    app.post(
      '/api/sendMessage', (req, res) => {
        console.log("sendMessage chiamata");
        console.log(req.body);
        const dataInvio = Date.now(); 
        db.run('INSERT INTO CAI_Messaggi(ruolo_id, testo, data_invio) VALUES (?, ?, ?)',
          [req.body.ruolo_id, req.body.message, dataInvio],
          function(err) {
            if (err) {
              return res.status(500).json({
                code: err.code,
                message: err.message
              });
            }
          const messID = this.lastID;
            // INSERT NELLA CROSS PER ASSOCIARE MESSAGGIO ALLA CONVERSAZIONE
          db.run('INSERT INTO CAI_convXmess(conv_id, mess_id) VALUES (?, ?)',
            [req.body.conv_id, messID],
              
            function(err) {
              if (err) {
              return res.status(500).json({
                code: err.code,
                message: "errore nell'inserimento della cross convXmess"
                })
              }
              res.json({
              successo: true,
              id: messID,
              testo: req.body.message,
              ruolo: req.body.ruolo_id,
              data_invio: dataInvio
              });
          });
        });
    });
  
  

  // API DI PROVA
  app.post(
    '/api/prova', (request, response) => {
        db.run(
          'INSERT INTO PROVA(id, nome, descr) VALUES (?,?,?)',
          [request.body.id, request.body.nome, request.body.descrizione],
          function(err) {

            if (err) {
              console.log(err.message);
              return response.status(500).json({
                code: err.code,
                message: err.message
              });
            }

            response.json({
              successo: true
            });
        });
    });

    // per leggere dati si usa get
    app.get(
      '/api/provaRead', (request, response) => {
        // per leggere dati anche qua si usa get
        db.get(
          'SELECT * FROM PROVA WHERE id = ?',
          [request.query.id],
          function(err, row) {

            if (err) {
              console.log(err.message);
              return response.status(500).json({
                code: err.code,
                message: err.message
              });
            }
            response.json(row);
      });
      
    });


        
    

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});