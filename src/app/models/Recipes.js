const db = require('../../config/db')


module.exports = {
  all(callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    `, function(err, results) {
      if(err) throw `"Database Error!" ${err}`

      callback(results.rows)
    })
  },
  find(id, callback) {

    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.id = $1`, [id], function(err, results) {
      if(err) throw `"Database Error!" ${err}`
      callback(results.rows[0])
    })
  },
  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        chef_id,
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at        
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `

    const values = [
      data.author, 
      data.image, 
      data.title, 
      data.ingredients, 
      data.preparation, 
      data.information,
      data.created_at
      
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `"Database Error!" ${err}`

      callback(results.rows[0])
    })
  },
  update(data, callback) {
    const query = `
    UPDATE recipes SET
      chef_id=($1),
      image=($2),
      title=($3),
      ingredients=($4),
      preparation=($5),
      information=($6)
      WHERE id = $7
    `

    const values = [
      data.author,
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id

    ]

    db.query(query, values, function(err, results) {
      if(err) throw `"Database Error!" ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){
      if(err) throw `"Database Error!" ${err}`

      return callback()
    })
  },
  findBy(filter, callback) {
    db.query(`
    SELECT recipes.*
    FROM recipes
    WHERE recipes.title ILIKE '%${filter}%'
    GROUP BY recipes.id
    ORDER BY recipes.id DESC `, function(err, results) {
      if(err) throw `"Database Error!" ${err}`

      callback(results.rows)
    })
  },
  chefSelectOptions(callback) {
    db.query(`SELECT name,id  FROM chefs`, function(err, results) {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }


}