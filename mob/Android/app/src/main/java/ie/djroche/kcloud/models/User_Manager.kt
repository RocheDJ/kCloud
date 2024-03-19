package ie.djroche.kcloud.models

import android.app.Application
import android.content.SharedPreferences
import androidx.lifecycle.MutableLiveData
import androidx.preference.PreferenceManager

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken


import timber.log.Timber

import java.lang.reflect.Type

// use volly to read data from webserver
//ref https://google.github.io/volley/
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import org.json.JSONObject
lateinit var httpQueue : RequestQueue // queue of HTTP requests
const val TEST_API_ENDPOINT = "http://34.240.177.253:3000";

class User_Manager(application: Application) : UserStore {

    // for JSON
    private var users = mutableListOf<UserModel>()
    private val gsonBuilder: Gson = GsonBuilder().setPrettyPrinting().create()
    private val listType: Type = object : TypeToken<ArrayList<UserModel>>() {}.type
    private var preferences: SharedPreferences
    private var application: Application? = null
    var liveUser = MutableLiveData<UserModel>()
    var loggedOut = MutableLiveData<Boolean>()
    var errorStatus = MutableLiveData<Boolean>()
    /*------------------------------------------------------------------------------------------------*/
    init {
        this.application = application
       // deserialize() // load users from JSON
        preferences = PreferenceManager.getDefaultSharedPreferences(application.applicationContext)
        val uid = preferences.getString("UserID",null)
        //TEST_API_ENDPOINT
        ie.djroche.kcloud.utils.httpQueue = Volley.newRequestQueue(application.applicationContext)
        var url = preferences.getString("API_Endpoint",TEST_API_ENDPOINT).toString()

        if (uid != null){
            url = url + "/user/id/"+uid
            val request: StringRequest =
                object : StringRequest(Request.Method.GET, url, object : Response.Listener<String?> {
                    override fun onResponse(response: String?) {
                        val jsonObject = JSONObject(response)
                        val sError = (jsonObject.getString("error"))
                       if (sError =="") {
                           val userResponceString =  jsonObject.getString("data")
                               val localUser : UserModel = UserModel()
                               if (localUser != null){
                                    liveUser.postValue(localUser!!)
                                    loggedOut.postValue(false)
                                    errorStatus.postValue(false)
                               }
                           }


                       }
                }, object : Response.ErrorListener {
                    override fun onErrorResponse(error: VolleyError?) {
                        // displaying toast message on response failure.
                        Timber.i("Send ReadQRDataRequest  Error ", "error is " + error!!.message)
                    }
                }) {
                    override fun getParams(): Map<String, String>? {
                        // below line we are creating a map for storing
                        // our values in key and value pair.
                        val params: MutableMap<String, String> = HashMap()
                        // on below line we are passing our key
                        // and value pair to our parameters.

                        return params
                    }
                }
            ie.djroche.kcloud.utils.httpQueue.add(request)   // add to the app queue
        }

    }
    /*------------------------------------------------------------------------------------------------*/
    override fun login(email: String?, password: String?): Boolean {
        var retVal: Boolean = false
        var url = preferences.getString("API_Endpoint",TEST_API_ENDPOINT).toString()

        url = url + "/user/authenticate"
        val request: StringRequest =
            object : StringRequest(Request.Method.POST, url, object : Response.Listener<String?> {
                override fun onResponse(response: String?) {
                    // response to validate user
                    val jsonObject = JSONObject(response.toString())
                    val xSuccess = (jsonObject.getBoolean("success"))
                    if (xSuccess) {
                        var localUser: UserModel = UserModel()
                        localUser.firstName = "k"
                        localUser.lastName= "Cloud"
                        localUser.email = email.toString()
                        localUser.id = jsonObject.getLong("id").toUInt()
                        liveUser.postValue(localUser)
                        //user logged in o
                        loggedOut.postValue(false)
                        SaveCurrentUser(localUser)
                        retVal = true
                    } else {
                        loggedOut.postValue(true)
                    }
                }
            }, object : Response.ErrorListener {
                override fun onErrorResponse(error: VolleyError?) {
                    // displaying toast message on response failure.
                    Timber.i("Send ReadQRDataRequest  Error ", "error is " + error!!.message)
                }
            }) {
                override fun getParams(): Map<String, String>? {
                    // below line we are creating a map for storing
                    // our values in key and value pair.
                    val params: MutableMap<String, String> = HashMap()
                    // on below line we are passing our key
                    // and value pair to our parameters.
                    params["email"] = email.toString()
                    params["password"] = password.toString()
                    return params
                }
            }
        try{
            Timber.i("Login user")
            ie.djroche.kcloud.utils.httpQueue.add(request)   // add to the app queue
        }catch (e: Exception) {
            Timber.i("login error : $e.message")
        }

        return retVal
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun update(user: UserModel) {
        Timber.i("Not yet implemented")
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun findAll(): List<UserModel> {
        TODO("Not yet implemented")
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun findUserById(userID: UInt): UserModel? {
        val foundUser = users.find { p -> p.id == userID }
        return foundUser
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun findUserByEmail(eMail: String): UserModel? {
        try {
            val foundUser: UserModel? =
                users.find { p -> p.email == eMail }
            return foundUser

        } catch (e: Exception) {
            timber.log.Timber.e("findUserByEmail Error %s", e.toString())
        }
        return null
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun register(user: UserModel): UInt {
        //ToDo: Add this method
        return 0u
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun register(email: String?, password: String?): UserModel? {
        try {
            var url = TEST_API_ENDPOINT
            url = url + "/user"
            var myUser =  UserModel()
            val request: StringRequest =
                object : StringRequest(Request.Method.POST, url, object : Response.Listener<String?> {
                    override fun onResponse(response: String?) {
                        // response to validate user
                        val jsonObject = JSONObject(response.toString())
                        val xSuccess = (jsonObject.getBoolean("success"))
                        if (xSuccess) {
                            //user logged in o
                            var myUser =  UserModel()
                            myUser.email = email.toString()
                            myUser.id = jsonObject.getLong("id").toUInt()
                            var token :   String = jsonObject.getString("token")
                            loggedOut.postValue(false)
                            liveUser.postValue(myUser!!)
                        }
                    }
                }, object : Response.ErrorListener {
                    override fun onErrorResponse(error: VolleyError?) {
                        // displaying toast message on response failure.
                        Timber.i("Register User Error ", "error is " + error!!.message)
                    }
                }) {
                    override fun getParams(): Map<String, String>? {
                        // below line we are creating a map for storing
                        // our values in key and value pair.
                        val params: MutableMap<String, String> = HashMap()
                        // on below line we are passing our key
                        // and value pair to our parameters.
                        params["firstName"] = "-"//ToDo: update actual data later
                        params["lastName"] = email.toString()//ToDo: update actual data later
                        params["mobile"] = "00353388000000" //ToDo: update actual data later
                        params["email"] = email.toString()
                        params["password"] = password.toString()
                        return params
                    }
                }
            try{
                Timber.i("Login user")
                ie.djroche.kcloud.utils.httpQueue.add(request)   // add to the app queue
            }catch (e: Exception) {
                Timber.i("login error : $e.message")
            }

            return myUser
        } catch (e: Exception) {
            timber.log.Timber.e("Register User Error %s", e.toString())
        }
        return null
    }

    /*------------------------------------------------------------------------------------------------*/
    override fun delete(user: UserModel) {
        users.remove(user)

    }

    /*------------------------------------------------------------------------------------------------*/
    override fun logOut() {
        SavelogoutUser()
        loggedOut.postValue(true)
        errorStatus.postValue(false)
    }

    /*-------------                      Private Functions         -------------------------------*/


    fun SaveCurrentUser(user : UserModel){
        var editor = preferences.edit()
        editor.putString("UserID", user.id.toString())
        editor.commit()
    }


    fun SavelogoutUser(){

        var editor = preferences.edit()
        editor.remove("UserID")
        editor.commit()
    }
}