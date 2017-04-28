// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
}])

.controller('ImageCtrl', function ($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {
  $scope.image = null;
  $scope.image2 = null;
  $scope.data = {};
  $scope.data.ident = '';
  $scope.data.lastName = '';
  $scope.data.name1 = '';
  $scope.data.bday = '';
  $scope.data.phone = '';
  $scope.data.email = '';
  $scope.data.amount = '';
  $scope.data.months = '';


  $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };

  // Present Actionsheet for switch beteen Camera / Library
  $scope.loadImage = function() {

  console.error("debug "+$scope.data.ident);
  console.error("debug "+$scope.data.lastName);
  console.error("debug "+$scope.data.name1);
  console.error("debug "+$scope.data.bday);
  console.error("debug "+$scope.data.phone);
  console.error("debug "+$scope.data.email);
  console.error("debug "+$scope.data.amount);
  console.error("debug "+$scope.data.months);

    var options = {
      title: 'Seleccionar Imagen',
      buttonLabels: ['Buscar en galeria', 'Usar Camara'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
    };
    $cordovaActionSheet.show(options).then(function(btnIndex) {
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type, 1);
      }
    });
  };
////desde aca el loadimage2
  $scope.loadImage2 = function() {

  console.error("debug "+$scope.data.ident);
  console.error("debug "+$scope.data.lastName);
  console.error("debug "+$scope.data.name1);
  console.error("debug "+$scope.data.bday);
  console.error("debug "+$scope.data.phone);
  console.error("debug "+$scope.data.email);
  console.error("debug "+$scope.data.amount);
  console.error("debug "+$scope.data.months);

    var options = {
      title: 'Seleccionar Imagen',
      buttonLabels: ['Buscar en galeria', 'Usar Camara'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
    };
    $cordovaActionSheet.show(options).then(function(btnIndex) {
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type, 2);
      }
    });
  };

  // Take image with the camera or from library and store it inside the app folder
  // Image will not be saved to users Library.

  $scope.selectPicture = function(sourceType, imgNumber) {
    var options = {
      quality: 20,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imagePath) {
      // Grab the file name of the photo in the temporary directory
      var currentName = imagePath.replace(/^.*[\\\/]/, '');

      //Create a new name for the photo
      var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";

      // If you are trying to load image from the gallery on Android we need special treatment!
      if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        window.FilePath.resolveNativePath(imagePath, function(entry) {
          window.resolveLocalFileSystemURL(entry, success, fail);
          function fail(e) {
            console.error('Error: ', e);
          }

          function success(fileEntry) {
            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
            // Only copy because of access rights
            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
              if (imgNumber == 1) {
                  $scope.image = newFileName;
               }else{
                  $scope.image2 = newFileName;
                  }

            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          };
        }
      );
      } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){


          if (imgNumber == 1) {
              $scope.image = newFileName;
           }else{
              $scope.image2 = newFileName;
              }

        }, function(error){
          $scope.showAlert('Error', error.exception);
        });
      }
    },
    function(err){
      // Not always an error, maybe cancel was pressed...
    })
  };

  // Returns the local path inside the app for an image
  $scope.pathForImage = function(image) {
    if (image === null) {
    return '';
    } else {
    return cordova.file.dataDirectory + image;
    }
  };



  $scope.uploadImage = function() {

    // Destination URL
    //var url = "http://192.168.30.108/americapp/api/index.php/upload2/";
    var url = "http://requestb.in/14ha6951";

    // File for Upload
    var targetPath = $scope.pathForImage($scope.image);
    var targetPath2 = $scope.pathForImage($scope.image2);


    // File name only
    var filename = $scope.image;
    var filename2 = $scope.image2;
    var firstName = $scope.data.name1;



            console.error("debug "+$scope.data.ident);
            console.error("debug "+$scope.data.lastName);
            console.error("debug "+$scope.data.name1);
            console.error("debug "+$scope.data.bday);
            console.error("debug "+$scope.data.phone);
            console.error("debug "+$scope.data.email);
            console.error("debug "+$scope.data.amount);
            console.error("debug "+$scope.data.months);


    var options = {
    fileKey: "front",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
            params : {'fileName': filename, 'name': firstName, 'lastname': $scope.data.lastName, 'ident': $scope.data.ident, 'bday': $scope.data.bday, 'phone': $scope.data.phone, 'email': $scope.data.email, 'amount': $scope.data.amount, 'months': $scope.data.months



            }
    };

    $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
//    $scope.showAlert('Success', 'Image upload finished.');
      console.log('Image upload finished1.');
    });

    var options2 = {
    fileKey: "back",
    fileName: filename2,
    chunkedMode: false,
    mimeType: "multipart/form-data",
            params : {'fileName': filename2, 'ident': $scope.data.ident
            }
    };

    $cordovaFileTransfer.upload(url, targetPath2, options2).then(function(result) {
  //  $scope.showAlert('Success', 'Image upload finished.');
      console.log('Image upload finished2.');
    });

  };//end uploadImage


  });
 // The rest of the app comes in here
