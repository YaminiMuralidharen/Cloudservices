
AWSCognito.config.region = 'REGION_NAME';
    var identityPoolId = 'IDENTITY_POOL_NAME';
    var poolData = { 
            UserPoolId : 'USER_POOL_ID',
            ClientId : 'CLIENT_ID'
        };
    var userPool =  new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var uname;
    var coguser,auth2;
 

    function onSignInSuccess(user) {
      // if (clicked) {
      var id_token = user.getAuthResponse().id_token;
      var profile = user.getBasicProfile();
      console.log('token' + id_token);
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: {
           'accounts.google.com': id_token
        }
     });
      AWS.config.credentials.get(function(){
        // Access AWS resources here.
           uname=profile.getName();
           $('.uname').html(uname);
           alert("Successfully Loggedin")
           $('#logout').show();
           $('#loginBtn').hide(); 
           $('#signupBtn').hide();
       });
  //   }
  }
 function onSignInFailure() {
  // Handle sign-in errors
  alert("Sign in failed")
}

  function signoutUser() {
      
       auth2 = gapi.auth2.getAuthInstance();
      if(auth2!=null) {
        console.log("google sign out");
      auth2.signOut().then(function () {
       console.log('User signed out.');
       uname='';
         $('.uname').html(uname);
       });
        auth2=null;
    }
    else if(coguser != null) {
      console.log("cognito user pool sign out");
   coguser.globalSignOut( {
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });
    coguser=null;
}

    $('#loginBtn').show(); 
      $('#signupBtn').show();
       $('#logout').hide();
  } 

  //function signoutUser() { }


$(function() {

     var clicked=false;
   $(document).on("click", ".navbar-right .dropdown-menu", function(e){
        e.stopPropagation();
   });
   $(document).ready(function () {
         $('#devdash').hide();
         if(coguser == null || auth2 == null)
          $('#logout').hide();
   });
  
  function validateForm(){
        return false;
    }
   /* function clickLogin()
  {
      clicked=true;
  } */


  
   
   $('#socialsignin').click(function(e) {
    e.preventDefault();
    console.log("inside socialsignin")
    clicked=true;
   });


    $('#login-submit').click(function(e) {
        e.preventDefault();
        //var username = $('#username').val()
        var email = $('#username').val()
        var password = $('#password').val()
      //  authenticateUser(username,password)
        authenticateUser(email,password)
        console.log(email,password)
    });

    $('#register-submit').click(function(e) {
        e.preventDefault();
        var username = $('#regusername').val()
        var email = $('#regemail').val()
      //  var phone = $('#phnum').val()
        var password = $('#regpassword').val()
        var confirmpassword = $('#confirm-password').val()

        addUser(username,email,password,confirmpassword)
        console.log(username,email,password,confirmpassword)
       
    });

     

   
 

    function addUser(username,email,password,confirmpassword){    
        var cognitoUser;
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        var attributeList = [];
         
        var dataEmail = {
            Name : 'email',
            Value : email
        };
        
      var dataGivenName = {
            Name : 'given_name',
            Value : username
        };
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
  
    var attributeGivenName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGivenName);

        attributeList.push(attributeEmail);
      
        attributeList.push(attributeGivenName);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            $('#myModal').modal({backdrop: 'static', keyboard: false})
            $('#myModal').modal('show');
            $('#verify-submit').click(function(e) {
                e.preventDefault();
                var verifycode = $('#verifycode').val()
                verifyUser(cognitoUser,verifycode)
                console.log(verifycode)
            });
            
        });
        $('resend-verify-code').click(function(){
            console.log("resend")
            resendVerifyCode(cognitoUser)
        })
        $('delete-user').click(function(){
            console.log("delete")
            deleteUser(cognitoUser)
        })
    }

   

     function authenticateUser(email,password){

        var authenticationData = {
            Username : email,
            Password : password,
        };
        console.log(authenticationData)
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var userData = {
            Username : email,
            Pool : userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('idToken + ' + result.idToken.jwtToken);
                alert("Successfully Loggedin")
                console.log(result)
                coguser=cognitoUser;
               // console.log('user attribute' + cognitoUser.getUserAttributes());
                 cognitoUser.getUserAttributes(function(err, result) {
             if (err) {
                alert("attribute error" + err);
                 return;
             }
            
              //  for (i = 0; i < result.length; i++) { }
                 console.log('attribute ' + result[3].getName() + ' has value ' + result[3].getValue());
                 var logemail=result[3].getName();
                 searchpattern=/s3url.awsapps.com/;
                if(logemail.search(searchpattern)) {
                  console.log("employee");
                    $('#devdash').show();
                }
                else
                  console.log("user login")
             });
                console.log('user name' + cognitoUser.getUsername());
               
              $('#uname').html(cognitoUser.getUsername());
              $('#logout').show();
              $('#loginBtn').hide(); 
              $('#signupBtn').hide();
            },

            onFailure: function(err) {
                console.log("auth error:",err)
                alert(err);
            },

        });
   
    }



function verifyUser(cognitoUser,verifycode){
        console.log(cognitoUser)
        cognitoUser.confirmRegistration(verifycode, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            $('#myModal').modal('hide');
            alert('Email confirmed. Login to S3URL')
            //window.location.href = '/verify.html';
            
        });
    } 
    function resendVerifyCode(cognitoUser){
        console.log("resendVerifyCode")
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                alert(err);
                return;
               }
            alert(result);
        });
    }
    function deleteUser(cognitoUser){
        console.log("deleteUser")
        cognitoUser.deleteUser(function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            $('#myModal').modal('hide');
        });
    }



});