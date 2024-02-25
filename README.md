E-commerce-app-API-s
This is a bunch of codes to make backend rest API's to be used in an E-commerce application.These endpoints are callable through a rest client.ex-Postman,etc.

We have made this project using Node js,Express js and Mysql as a Database.

Setting up the project:

->Install Node js and Visual Studio Code on your system.

->Copy the project from this github repository and place it into a folder.

->Open the folder in Visual Studio Code and open terminal in it.

->Run the command 'npm init'.This will create node_modules in your project.

->Install the required libraries by running the command 'npm install express body-parser jsonwebtoken mysql bcryptjs dotenv'.This will install the required libraries in your folder.

->Open Mysql

->Create .env file

->In the places where 'process.env....' is written,you have to write your own keywords in that which you will save in your .env file like secret key for jwt token,password for your Mysql database,etc.This file is not to be uploaded on github.

->Finally ,save all your files and in the terminal run 'node index.js'.This will start your server on the given port and also establish connection between the server and the Database.

Important design decision made during development is the correct development of database tables and attributes in it.

Following are the different tables to be made in the database along with attributes:

1)Users(user_id,username,password)

2)Categories(category_id,products)

3)Products(product_id,product_name,price,quantity

4)Cart(user_id,product_id,quantity)

5)Orders(order_id,user_id,product_id,quantity,price,created_at)

->Insert the dummy data into these database tables and then check the API's through the rest client like Postman,Insomnia,etc.

Following is the API doc:

INFORMATION RELATED TO EACH API ENDPOINT: 

1)app.post/register: ->This particular endpoint is used to register the user. This particular endpoint will require you to input an username and password. If any error occurs during the registration procedure,it will send a status code of 500 and a message of “Internal server error”. If registration occurs successfully,it will send a status code of 200 and a message of “User registered successfully”.

2)app.post/login: ->This endpoint is used to login the user.It requires to input the username and password. If there is an error occurring in the login procedure,it sends a response code of 500 and a message of “Internal server error”. If a user enters an invalid username or password ,it sends a status code of 401 with a message of “Invalid username or password”. If the username and password is correct,it sends a status code of 200 along with a jwt token.

3)app.get/categories: ->If any error occurs,it sends a status code of 500 and a message of “internal server error”.In case of no errors,it displays the categories along with other information from the database with a status code of 200.

4)app.get/products: ->If case of any error it sends a status code of 500 and displays “internal server error” .It requires to input the categoryID and in output,it displays a list of products belonging to that categoryID and also sends a status code of 200.

5)app.get/products/:id : ->It requires to send a productId as input .If any error occurs ,it sends a status code of 500 and “internal server error” else it displays the details of products belonging to that particular id.If any invalid id is sent,it sends a message of “product not found” with a status code of 404.

6)app.post/cart/add: ->It requires userID,productID,and the quantity of product to be sent and if any error occurs ,it performs the same previous task else it adds a particular product to the user’s cart along with the quantity of that product and increases the products’ respective quantity .

7)app.get/cart: ->It requires to send the users’ Id and it sends the information of the products of that particular user along with the information of each of those products.

8)app.put/cart/:productId : ->It requires the userID,productID,quantity of the product to be sent and thenit updates the new quantity of that particular product of that particular user.

9)app.delete/cart/:productId : ->It requires to send userID and a productID and the particular product sent by the particular user gets deleted from its cart .

10)app.post /order/place: ->It requires the userID and product to be sent and it places those products in the cart of the particular user along with the calculation of the price of that product and the date of placing of order of that product.

11)app.get /orders/history: ->It requires to send the userID and it gets the whole information related to all the orders being placed by the user alongwith respective dates.

12)app.get /orders/:orderId: ->It requires an orderID to be sent and all the information related to that particular order gets displayed.

Alongwith these responses,respective status codes and messages or error messages are also sent back in all the API’s as mentioned in the above previous some API’s.

Also,our project is secured using the Middlewares.
