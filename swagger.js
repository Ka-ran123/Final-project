import swaggerJsDoc from "swagger-jsdoc"
import swaggerui from "swagger-ui-express"

const options={
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'rentroom Website Apis',
          version: '1.0.0',
        },
        servers:[{
            url: 'http://localhost:5432'
        }]
    },
    apis:['swagger.js']
}

const swaggerSpec=swaggerJsDoc(options);

const swaggerDocs=function swaggerDocs(app){
    app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerSpec))
}
export {swaggerDocs}

//Auth schema
/**
 * @swagger
 *  components:
 *      schemas:
 *          signup:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  mobileNo:
 *                      type: string
 *          signin:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *          verifyemail:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *          verifyotp:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  otp: 
 *                      type: string
 *          forgotpassword:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *          resetpassword:
 *              type: object
 *              properties:
 *                  email: 
 *                      type: string
 *                  newPassword:
 *                      typr: string
 *          changepassword:
 *              type: object
 *              properties:
 *                  oldPassword:
 *                      type: string
 *                  newPassword:
 *                      type: string
 *          changeprofilepic:
 *              type: object
 *              properties:
 *                  profilePic:
 *                      type: string
 *                      format: binary
 *          googlelogin:
 *              type: object
 *              properties:
 *                  token:
 *                      type: string
 */

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *  post:
 *      summary: signup user
 *      description: signup user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/signup'
 *      responses:
 *          200:
 *              description: User Added
 */

/**
 * @swagger
 * /api/v1/auth/sign-in:
 *  post:
 *      summary: signin user
 *      description: signin user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/signin'
 *      responses:
 *          200:
 *              description: User login
 */

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *  post:
 *      summary: verify user email
 *      description: verify user email
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/verifyemail'
 *      responses:
 *          200:
 *              description: otp send in this email
 */

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *  post:
 *      summary: verify email otp
 *      description: verify email otp
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/verifyotp'
 *      responses:
 *          200:
 *              description: otp verify
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *  post:
 *      summary: forgot password
 *      description: otp send in this email
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/forgotpassword'
 *      responses:
 *          200:
 *              description: otp send in email
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *  post:
 *      summary: reset password
 *      description: reset password 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/resetpassword'
 *      responses:
 *          200:
 *              description: password reset successfully
 */

/**
 * @swagger
 * /api/v1/auth/change-password:
 *  post:
 *      summary: change password
 *      description: change password
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/changepassword'
 *      responses:
 *          200:
 *              description: change password successfully
 */

/**
 * @swagger
 * /api/v1/auth/get-user:
 *  get:
 *      summary: get user data
 *      description: get user data
 *      responses:
 *          200:
 *              description: get user data
 */

/**
 * @swagger
 * /api/v1/auth/change-profilePic:
 *  post:
 *      summary: change profile pic
 *      description: change profile pic
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#components/schemas/changeprofilepic'
 *      responses:
 *          200:
 *              description: change profile pic 
 */

/**
 * @swagger
 * /api/v1/auth/delete-profilePic:
 *  delete:
 *      summary: delete profile pic
 *      description: delete profile pic
 *      responses:
 *          200:
 *              description: delete profile pic 
 */

/**
 * @swagger
 * /api/v1/auth/google-login:
 *  post:
 *      summary: google login user
 *      description: google login user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/googlelogin'
 *      responses:
 *          200:
 *              description: login successfully
 */