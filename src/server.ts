import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { requireAuth } from './controllers/auth.router';
import * as jwt from "jsonwebtoken";
import {config} from "./config/config";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get('/filteredimage', async (req: Request, res: Response) => {

    // 1 Validate the image_url query
    const imageUrl = req.query.image_url;
    if (!imageUrl) {
      return res.status(400).send("image_url parameter is required");
    }

    // 2 call filterImageFromURL(image_url) to filter the image
    // TODO Check for errorsanc
    const filteredImage = await filterImageFromURL(imageUrl);

    // 3 send the resulting file in the response
    res.sendFile(
      filteredImage,
      // 4 deletes any files on the server on finish of the response
      () => deleteLocalFiles([filteredImage])
    );
  } );

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
