# BullsFrog Restoration Invoice Application - Integrated with Knacks API
BullsFrog invoice/estimating application

# API

## Credentials
>Neccessary to communicate with Knack's Object Based Request API  

## Authentication 
Auth will be in sync with the main BullsFrog Knack's App. 
A user can logged in with a `POST` request to the following route with the user's email address and password included in the JSON payload.

`https://api.knack.com/v1/applications/<app_id>/session`


