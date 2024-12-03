import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocal: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
    },
});

sequelize.authenticate()
.then(() => console.log('Connection has been established successfully.'))
.catch((err) => console.error('Unable to connect to the database:', err));

export default sequelize;
