import {Car, cars as cars_list} from './cars';
import express, {Request, Response} from 'express';

import bodyParser from 'body-parser';

(async () => {
   let cars: Car[] = cars_list;

   //Create an express applicaiton
   const app = express();
   //default port to listen
   const port = 8082;

   //use middleware so post bodies
   //are accessable as req.body.{{variable}}
   app.use(bodyParser.json());

   // Root URI call
   app.get('/', (req: Request, res: Response) => {
      res.status(200).send('Welcome to the Cloud!');
   });

   // Get a greeting to a specific person
   // to demonstrate routing parameters
   // > try it {{host}}/persons/:the_name
   app.get('/persons/:name', (req: Request, res: Response) => {
      let {name} = req.params;

      if (!name) {
         return res.status(400).send(`name is required`);
      }

      return res.status(200).send(`Welcome to the Cloud, ${name}!`);
   });

   // Get a greeting to a specific person to demonstrate req.query
   // > try it {{host}}/persons?name=the_name
   app.get('/persons/', (req: Request, res: Response) => {
      let {name} = req.query;

      if (!name) {
         return res.status(400).send(`name is required`);
      }

      return res.status(200).send(`Welcome to the Cloud, ${name}!`);
   });

   // Post a greeting to a specific person
   // to demonstrate req.body
   // > try it by posting {"name": "the_name" } as
   // an application/json body to {{host}}/persons
   app.post('/persons', async (req: Request, res: Response) => {
      const {name} = req.body;
      if (!name) {
         return res.status(400).send(`name is required`);
      }

      return res.status(200).send(`Welcome to the Cloud, ${name}!`);
   });

   // @TODO Add an endpoint to GET a list of cars
   // it should be filterable by make with a query paramater
   app.get('/cars/', (req: Request, res: Response) => {
      const {make} = req.query;

      let car_list = cars;

      if (make) {
         car_list = cars.filter((car) => car.make === make);
      }

      res.status(200).send(car_list);
   });

   // @TODO Add an endpoint to get a specific car
   // it should require id
   // it should fail gracefully if no matching car is found
   app.get('/cars/:id', (req: Request, res: Response) => {
      let {id} = req.params;
      console.log(id);

      if (!id) {
         return res.status(400).send(`id is required`);
      }

      const car = cars.filter((car) => car.id == id);

      // respond not found, if we do not have this id
      if (car && car.length === 0) {
         return res.status(404).send(`car is not found`);
      }

      //return the car with a sucess status code
      res.status(200).send(car);
   });

   /// @TODO Add an endpoint to post a new car to our list
   // it should require id, type, model, and cost
   app.post('/cars/', (req: Request, res: Response) => {
      let {make, type, model, cost, id} = req.body;

      if (!id || !make || !type || !model || !cost) {
         return res.status(400).send(`make, type, cost, id are required`);
      }

      const new_car: Car = {
         make: make,
         type: type,
         model: model,
         cost: cost,
         id: id,
      };

      cars.push(new_car);

      res.status(201).send(new_car);
   });

   // Start the Server
   app.listen(port, () => {
      console.log(`server running http://localhost:${port}`);
      console.log(`press CTRL+C to stop server`);
   });
})();
