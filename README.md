[![Build Status](https://travis-ci.org/bisonlou/challenge-III.svg?branch=develop)](https://travis-ci.org/bisonlou/challenge-III) [![Maintainability](https://api.codeclimate.com/v1/badges/905ff33bc96ec34e49d9/maintainability)](https://codeclimate.com/github/bisonlou/challenge-III/maintainability) [![Coverage Status](https://coveralls.io/repos/github/bisonlou/challenge-III/badge.svg?branch=ft-user-can-register)](https://coveralls.io/github/bisonlou/challenge-III?branch=ft-user-can-register)

##### A web api to aid government and citizens reduce corruption, and holding leaders and representatives honest and efficient.


Installation
------------
To access the api, browse to https://knightedge.herokuapp.com/ using postman

To access the web app, browse to https://bisonlou.github.io/Challenge-IV/UI/index.html 

Technology
-------------
```
Language:  Python
Framework: Flask

```

How to use
------------
```bash
git clone https://github.com/bisonlou/ireporter.git

cd ireporter

virtualenv venv

source venv/Scripts/activate

pip install -r requirements.txt

export variable URI as postrgress connection string

export variable SECRET_KEY as jwt encryption string

python app.py

```

How to test
------------
```bash

pytest

```

End Points
-------------

|Method     |Route                                      |Function                               |
|:----------|:------------------------------------------|:--------------------------------------|
|POST       |/api/v1/register                           |Register user                          |
|POST       |/api/v1/login                              |Login                                  |
|POST       |/api/v1/redflags                           |Post red flag                          |               
|POST       |/api/v1/intervention                       |Post intervention                      |
|GET        |/api/v1/users                              |Get users                              |
|GET        |/api/v1/redflags                           |Get red flags                          |
|GET        |/api/v1/interventions                      |Get interventions                      |
|GET        |/api/v1/redflags/id                        |Get a red flag                         |
|GET        |/api/v1/interventions/id                   |Get an intervention                    |
|PUT        |/api/v1/redflags/id                        |Put a redflag                          |
|PUT        |/api/v1/interventions/id                   |Put an intervention                    |
|PATCH      |/api/v1/redflags/id/location               |Patch red flag location                |
|PATCH      |/api/v1/redflags/id/comment                |Patch red flag comment                 |               
|PATCH      |/api/v1/interventions/id/location          |Patch an intervention location         |
|PATCH      |/api/v1/interventions/id/comment           |Patch an intervention comment          |
|PATCH      |/api/v1/redflags/id                        |Escalate a red flag                    |
|PATCH      |/api/v1/interventions/id                   |Escalate an intervention               |
|DELETE     |/api/v1/redflags/id                        |Delete a red flag                      |
|DELETE     |/api/v1/interventions/id                   |Patch an intervention                  |




**Contributers**
----------------
Innocent Lou <bisonlou@gmail.com>

How to Contribute
-----------------
```
1.  Check for open issues or open a fresh issue to start a discussion
    around a feature idea or a bug.
2.  Clone [the repository](https://github.com/bisonlou/ireporter.git) on
    GitHub to start making your changes to the **deploy** branch (or
    branch off of it).
3.  Write a test which shows that the bug was fixed or that the feature
    works as expected.
4.  Send a pull request and bug the maintainer until it gets merged and
    published. 
```

**License**
------------------
Read only

=======

