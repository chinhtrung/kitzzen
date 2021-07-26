<!-- This is taken from the template https://github.com/othneildrew/Best-README-Template  -->

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://kitzzen.herokuapp.com/">
    <img src="https://res.cloudinary.com/projectstore/image/upload/v1627239637/logo/Color_logo_with_background.png" alt="Logo" width="200">
  </a>

  <h3 align="center">kitzzen: start a business at your kitchen</h3>

  <p align="center">
    <!-- An awesome README template to jumpstart your projects!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br /> -->
    <a href="https://kitzzen.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/chinhtrung/kitzzen/issues">Report Bug</a>
    ·
    <a href="https://github.com/chinhtrung/kitzzen/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![kitzzen home page screenshot][product-screenshot]][product-screenshot]
[![kitzzen product page screenshot][product-food-screenshot]][product-food-screenshot]
[![kitzzen user page screenshot][product-user-screenshot]][product-user-screenshot]

This side project is motivated by the idea of building a platform for users to buy food from local kitchen and also a place local kitchens display their food to sale. Many people have very high cooking skill and [kitzzen][product-home] provides a market place where they can sell their food without opening a restaurant. 

### Built With
Backend
* [node.js](https://nodejs.org/en/)
* [express.js](https://expressjs.com/)
* [mapbox](https://www.mapbox.com/)
* [cloudinary](https://cloudinary.com/)
* [mongodb cloud](https://www.mongodb.com/cloud)
* [passport js](http://www.passportjs.org/)
* [nodemailer](https://nodemailer.com/about/)
* [nodemon npm package](https://www.npmjs.com/package/nodemon)
* [And many more which are shown in package.json](https://github.com/chinhtrung/kitzzen/blob/main/package.json)

Frontend
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [EJS](https://ejs.co/)
* [Fontawesome](https://fontawesome.com/)
* [Semantic-ui](https://semantic-ui.com/)


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites
Install npm to your local machine
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the current repo
    ```sh
    git clone https://github.com/chinhtrung/kitzzen.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Install nodemon globally
    ```sh
    npm install nodemon
    ```
4. Setup your enviroment variables/secrets and save it inside .env file
    ```sh
    cat > .env
    PORT=8080
    IP=<your_ip_address>
    DATABASEURL=<your_databaseurl>

    CLOUD_NAME=<your_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloundinary_api_key>

    GMAIL=<your_email>
    GMAILPW=<your_email_password>
    ADMIN_CODE=<your_admin_code>

    MAPBOX_TOKEN=<your_mapbox_token>
    ```
4. Start the server
   ```sh
   nodemon app.js
   ```
5. Open your localhost at port 8080 on your web browser [localhost:8080](http://localhost:8080/)



<!-- USAGE EXAMPLES -->
## Usage
* Post your food online with location and time available for others to see and book
* Look for foods to eat from local kitchens
* Discuss with your customer about shipping method (either pickup or deliver)


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License.

<!-- CONTACT -->
## Contact

Trung Nguyen - chinhtrung596@gmail.com

Project Link: [https://github.com/chinhtrung/kitzzen](https://github.com/chinhtrung/kitzzen)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [codepen: loading animation sample design (by Tanmay Naik)](https://codepen.io/Blazephoenix_/pen/xJmmXE)
* [unsplash: free open source image](https://unsplash.com/)
* [heroku: deploy server](https://www.heroku.com/)

## Have fun :smile:



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-home]: https://kitzzen.herokuapp.com/
[product-screenshot]: https://res.cloudinary.com/projectstore/image/upload/v1627317138/utils/screenshot_page.png
[product-food-screenshot]: https://res.cloudinary.com/projectstore/image/upload/v1627317516/utils/screenshot_food_page.png
[product-user-screenshot]: https://res.cloudinary.com/projectstore/image/upload/v1627317766/utils/screenshot_user_page.png
