const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const bodyParser = require('body-parser');


const pool = new Pool({
    user: 'vadev',
    host: 'localhost',
    database: 'epos',
    password: '12345',
    port: 9512
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT || 3034;


//Запрос для анализа
app.post('/analyze-text', (req, res) => {
    const text = req.body.text;

    if (!text) {
        console.error('Text is required');
        return res.status(400).json({ error: 'Text is required' });
    }

    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: './',
        args: [text]
    };

    let pyshell = new PythonShell('analysais.py', options);

    let results = ''; 

    pyshell.on('message', function (message) {
        
        console.log(message);
        results += message + '\n'; 
    });

    pyshell.end(function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred during analysis' });
        }

        res.json({ results });
    });
});

//Запрос для генерации
app.post('/generate-prompt', (req, res) => {
    const text = req.body.text;

    if (!text) {
        console.error('Text is required');
        return res.status(400).json({ error: 'Text is required' });
    }

    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'], 
        scriptPath: './',
        args: [text] 
    };

    let pyshell = new PythonShell('Generator.py', options);

    let results = ''; 

    pyshell.on('message', function (message) {
        console.log(message);
        results += message + '\n'; 
    });

    pyshell.end(function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error on Generating prompt' });
        }
        res.json({ results });
    });
});

//Вывод сохранённых промптов
app.post('/save_prompt', async (req, res) => {
    const { prompt_text, meta_inf } = req.body;

    if (!prompt_text || !meta_inf) {
        return res.status(400).json({ error: 'Prompt text and meta information are required' });
    }

    const { author, name, bot_id, description, source } = meta_inf;

    try {
        // Вставляем данные в таблицу meta_inf
        const metaInfResult = await pool.query(
            `INSERT INTO promt_eng.meta_inf (author, name, bot_id, description, source)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [author, name, bot_id, description, source]
        );
        const metaInfId = metaInfResult.rows[0].id;

        // Вставляем данные в таблицу promt
        await pool.query(
            `INSERT INTO promt_eng.promt (id_meta_inf, promt_text)
             VALUES ($1, $2)`,
            [metaInfId, prompt_text]
        );

        res.status(200).json({ message: 'Prompt saved successfully' });
    } catch (error) {
        console.error('Error saving prompt:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Прокси-сервер работает');
  });

app.get('/get_theme', async (req, res) => { //1 парам - путь, 2 парам - что даем/полукчаем(объект)
    q = await pool.query('SELECT * from promt_eng.theme');
    res. status(200).json(q.rows); 
  })
app.get('/get_type', async (req, res) => { //1 парам - путь, 2 парам - что даем/полукчаем(объект)
    q = await pool.query('SELECT * from promt_eng.promt_type');
    res. status(200).json(q.rows); 
  })

app.get('/get_theme_of_prompt', async (req, res) => { //1 парам - путь, 2 парам - что даем/полукчаем(объект)
    q = await pool.query(`SELECT top.name_type from promt_eng.theme_of_promt top`);
    res. status(200).json(q.rows); 
  })

app.get('/get_meta_inf', async (req, res) => { //1 парам - путь, 2 парам - что даем/полукчаем(объект)
    q = await pool.query('SELECT * from promt_eng.meta_inf');
    res. status(200).json(q.rows); 
  })


  app.get('/prompts_types/:type', async (req, res) => {
    const type = req.params.type;

    if (isNaN(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const result = await pool.query(`
            SELECT pt.text
            FROM promt_eng.promt_text pt
            JOIN promt_eng.promt_type pty ON pt.type = pty.id
            WHERE pty.id = $1;
        `, [type]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching prompts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/prompts_themes/:themeId', async (req, res) => {
    const themeId = parseInt(req.params.themeId, 10); 
    if (isNaN(themeId)) {
        return res.status(400).json({ error: 'Invalid themeId' });
    }
    try {
        const result = await pool.query(`
            SELECT 
             pt.text
            FROM 
                promt_eng.promt_text pt
            JOIN 
            promt_eng.text_of_theme tot ON pt.id = tot.id_text
            JOIN 
            promt_eng.theme t ON tot.id_theme = t.id
            WHERE 
                t.id = $1
        `, [themeId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching prompts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Фильтрация по темам
app.get('/filter_prompts', async (req, res) => {
    const { themes, types } = req.query;
    let query = `
      SELECT pt.text, pty.name_type AS type_name
      FROM promt_eng.promt_text pt
      JOIN promt_eng.promt_type pty ON pt.type = pty.id
    `;
    let conditions = [];
    let values = [];
  
    if (themes) {
      const themesArray = themes.split(',').map(Number);
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM promt_eng.text_of_theme tot
          JOIN promt_eng.theme t ON tot.id_theme = t.id
          WHERE tot.id_text = pt.id AND t.id = ANY($${values.length + 1})
        )
      `);
      values.push(themesArray);
    }
  
    if (types) {
      const typesArray = types.split(',').map(Number);
      conditions.push(`pt.type = ANY($${values.length + 1})`);
      values.push(typesArray);
    }
  
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err) {
      console.error('Ошибка при фильтрации промптов:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.get('/get_saved_prompts', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.id, p.promt_text, mi.author, mi.name, mi.description, mi.source
        FROM promt_eng.promt p
        JOIN promt_eng.meta_inf mi ON p.id_meta_inf = mi.id
        WHERE mi.source = 'Users-prompt'
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Ошибка при получении сохранённых промптов:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  
  
  
  
app.listen(port, () => {
    console.log(`Сервер запушен ${port}`);
    });