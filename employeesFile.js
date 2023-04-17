let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var port=process.env.PORT ||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));


const {Client}=require("pg");
 const client=new Client({
    user: "postgres",
    password: "KiranJoshi@123",
    database: "postgres",
    port: 5432,
    host:"db.fzxawqyafzpldctxrqkb.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log(`Connected!!!`);
});


app.get("/employees",function(req,res,next){
    console.log("Inside/employees get api");
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
     let  query=`SELECT * FROM employees`;
  
    client.query(query,function(err,result){
    console.log(result.rows);
        if (err) {res.status(400).send(err);}
        if(department){
            result.rows=result.rows.filter((rs)=>rs.department==department);   
        }
        if(designation){
            result.rows=result.rows.filter((rs)=>rs.designation==designation);   
        }
        if(gender){
            result.rows=result.rows.filter((rs)=>rs.gender==gender);   
        }
      
        res.send(result.rows);
       
       //client.end();
    });
});

app.get("/employees/:id",function(req,res,next){
    console.log("Inside/employees/id get api");
    let id=req.params.id;
    let values=[id]
    const query=`SELECT * FROM employees WHERE  empCode=$1`;
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
       // client.end();
    });
});
app.get("/employees/department/:department",function(req,res,next){
    console.log("Inside/employees/department get api");
    let department=req.params.department;
    let values=[department]
    const query=`SELECT * FROM employees WHERE  department=$1`;
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
       // client.end();
    });
});
app.get("/employees/designation/:designation",function(req,res,next){
    console.log("Inside/employees/designation get api");
    let designation=req.params.designation;
    let values=[designation]
    const query=`SELECT * FROM employees WHERE  designation=$1`;
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
       // client.end();
    });
});

app.put("/employees/:id",function(req,res,next){
    console.log("Inside put of employees");
    let empCode=req.params.id;
    let name=req.body.name
    let department=req.body.department;
    let designation=req.body.designation;
    let salary=req.body.salary;
    let gender=req.body.gender;
    let values=[empCode,name,department,designation,salary,gender]
    const query=
    `UPDATE employees SET name=$2,department=$3,designation=$4,salary=$5,gender=$6 WHERE empCode=$1`;
    client.query(query,values,function(err,result){
        if(err){ res.status(400).send(err);}
        res.send(`${result.rowCount} updation successful`);
    });
});

app.delete("/employees/:id",function(req,res,next){
    console.log("Inside put of employees");
    let empCode=req.params.id;
    let values=[empCode]
    const query=
    `DELETE FROM employees WHERE empCode=$1`;
    client.query(query,values,function(err,result){
        if(err){ res.status(400).send(err);}
        res.send(`${result.rowCount} deletion successful`);
    });
});

app.post("/employees",function(req,res,next){
    console.log("Inside post of user");
    var values=Object.values(req.body);
    console.log(values);
    const query=`
 INSERT INTO employees (empCode,name,department,designation,salary,gender) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if(err){
            res.status(400).send(err);
        }
        console.log(result);
        res.send(`${result.rowCount} insertion successful`);
    });
});

app.put("/employees/:id",function(req,res){
    let body=req.body;
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let mobilesArray=JSON.parse(data);
            let index=mobilesArray.findIndex((st)=>st.empCode===id);
            if(index>=0){
                updateMobile={...mobilesArray[index],...body};
                mobilesArray[index]=updateMobile;
            let data1=JSON.stringify(mobilesArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(updateMobile);
            });
        }else res.status(404).send("NO mobile found");
    }
    });
});
app.delete("/employees/:id",function(req,res){
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let index=studentsArray.findIndex((st)=>st.empCode===id);
            if(index>=0){
               let deleteStudent=studentsArray.splice(index,1);
            let data1=JSON.stringify(studentsArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(deleteStudent);
            });
        }else res.status(404).send("NO employee found");
    }
    });
});

/*app.get("/users",function(req,res,next){
    console.log("Inside/users get api");
    const query=`SELECT * FROM users`;
    client.query(query,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
        client.end();
    });
});

 app.post("/users",function(req,res,next){
    console.log("Inside post of user");
    var values=Object.values(req.body);
    console.log(values);
    const query=`
    INSERT INTO users (email,firstname,lastname,age) VALUES ($1,$2,$3,$4)`;
    client.query(query,values,function(err,result){
        if(err){
            res.status(400).send(err);
        }
        console.log(result);
        res.send(`${result.rowCount} insertion successful`);
    });
});

app.put("/user/:id",function(req,res,next){
    console.log("Inside put of user");
    let userId=req.params.id;
    let age=req.body.age;
    let values=[age,userId]
    const query=`UPDATE users SET age=$1 WHERE id=$2`;
    client.query(query,values,function(err,result){
        if(err){ res.status(400).send(err);}
        res.send(`${result.rowCount} updation successful`);
    });
});


app.put("/user/:id",function(req,res,next){
    console.log("Inside put of user");
    let userId=req.params.id;
    let age=req.body.age;
    let values=[age,userId]
    const query=`UPDATE users SET age=$1 WHERE id=$2`;
    client.query(query,values,function(err,result){
        if(err){ res.status(400).send(err);}
        res.send(`${result.rowCount} updation successful`);
    });
});*/



/*app.get("/employees/resetData",function(req,res){
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employeesTable";
    connection.query(sql,function(err,result){
        if(err) console.log(err);
        else {
        
            let data=JSON.stringify(result);
            fs.writeFile(fname,data,function(err){
                if(err) res.status(404),send(err);
                else res.send("Data in file is reset");
            });
        };
    });
  
});*/


/*app.get("/employees",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let mobilesArray=JSON.parse(data);
            let department=req.query.department;
            let designation=req.query.designation;
            let gender=req.query.gender;
            let arr1=mobilesArray;
            if(department){
                arr1=arr1.filter((st)=>st.department===department);
            }
            if(designation){
                arr1=arr1.filter((st)=>st.designation===designation);
            }
            if(gender){
                arr1=arr1.filter((st)=>st.gender===gender);
            }
            res.send(arr1);
        }
    });
});
app.get("/employees/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            console.log(studentsArray);
            let student=studentsArray.find((st)=>st.empCode==id);
          if(student)  res.send(student);
          else res.status(404).send("No Mobile found");
        }
    });
});
app.get("/employees/designation/:designation",function(req,res){
    let designation=req.params.designation;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let student=studentsArray.filter((st)=>st.designation==designation); 
          if(student)  res.send(student);
          else res.status(404).send("No employee found");
        }
    });
});
app.get("/employees/department/:department",function(req,res){
    let department=req.params.department;
 
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let student=studentsArray.filter((st)=>st.department==department); 
          if(student)  res.send(student);
          else res.status(404).send("No employee found");
        }
    });
});*/






{/*app.post("/employees",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if (err){ res.status(404).send(err+"error in read part");
   }
        else{
            let mobilesArray=JSON.parse(data);
            let newCustomer={...body };
            
            mobilesArray.push(newCustomer);
            let data1=JSON.stringify(mobilesArray);
            fs.writeFile(fname,data1,function (err){
                if(err){ res.status(404).send(err+"err in write part")
            }
                else{ 
                  
                    res.send(newCustomer)
                };
            });
        }
    });
});*/}


/*app.get("/resetData",function(req,res){
    let data=JSON.stringify(mobilesData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404),send(err);
        else res.send("Data in file is reset");
    });
});*/






