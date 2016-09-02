import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

declare var serial:any;
declare var escape:any;
declare var unescape:any;

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  logs:any                      =   [];

  constructor(private navCtrl: NavController) {
  
  }

  onPageLoaded() {


      var open = false;
      var str = '';
      var lastRead = new Date();
      let self                  =   this;

      var errorCallback = function(message) {
          alert('Error: ' + message);
      };

      self.logs.push("On Page Loaded");
      serial.requestPermission(

          // if user grants permission
          function(successMessage) {

              self.logs.push(successMessage);

              // open serial port
              serial.open(
                  {baudRate: 9600},
                  // if port is succesfuly opened
                  function(successMessage) {

                      let open = true;

                      serial.read(
                        function success(buffer) {
                            self.logs.push('Data received');
                            self.logs.push(buffer);
                        }, errorCallback
                      );
                    

                      self.logs.push(successMessage);

                      // register the read callback
                      serial.registerReadCallback(
                          function success(data){

                              self.logs.push("RegisterReadCallback - Data : ");
                              self.logs.push(data.toString());

                              // decode the received message
                              var view = new Uint8Array(data);

                              self.logs.push("RegisterReadCallback - View : ");
                              self.logs.push(view.toString());

                              if(view.length >= 1) {
                                  for(var i=0; i < view.length; i++) {
                                      // if we received a \n, the message is complete, display it
                                      if(view[i] == 13) {
                                          // check if the read rate correspond to the arduino serial print rate
                                          var now = new Date();
                                          //delta.innerText = now - lastRead;
                                          lastRead = now;
                                          // display the message
                                          var value = parseInt(str);
                                          console.log('Pot ', value);
                                          str = '';
                                      }
                                      // if not, concatenate with the begening of the message
                                      else {
                                          var temp_str = String.fromCharCode(view[i]);
                                          var str_esc = escape(temp_str);
                                          str += unescape(str_esc);
                                      }
                                  }
                                  self.logs.push("RegisterReadCallback - After FOR - " + value);
                              } else {
                                  self.logs.push("View length is 0");
                              }
                          },
                          // error attaching the callback
                          errorCallback
                      );
                  },
                  // error opening the port
                  errorCallback
              );
          },
          // user does not grant permission
          errorCallback
      );

  }

}
