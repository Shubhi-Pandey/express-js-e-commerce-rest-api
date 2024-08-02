import './app';
import { appDataSource } from './dataSource';

appDataSource.initialize()
   .then(()=>{
    console.log("database connected successfully")
   })
   .catch((error) => console.log(error))