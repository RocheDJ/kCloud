package ie.djroche.kcloud.models

import android.app.Application
import android.content.SharedPreferences
import androidx.lifecycle.MutableLiveData
import androidx.preference.PreferenceManager
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.StringRequest

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken
import org.json.JSONArray
import timber.log.Timber
import java.lang.reflect.Type

val listKpiType: Type = object : TypeToken<ArrayList<PVOModel>>() {}.type

class Site_Manager(application: Application) : InstallationStore  {
    // JSON model decelerations
    val listType: Type = object : TypeToken<ArrayList<InstallationModel>>() {}.type
    val gsonBuilder: Gson = GsonBuilder().setPrettyPrinting()
        .create()
    private var installations = mutableListOf<InstallationModel>()  // for JSON
    private var application: Application = Application()
    private var preferences: SharedPreferences


    init{
        this.application = application
        preferences = PreferenceManager.getDefaultSharedPreferences(application.applicationContext)

    }

    //--------------------------------------------------------------------------------------------------
    override fun findByQR(userID: UInt, QRCode: String, site: MutableLiveData<InstallationModel>) {
            val foundSite: InstallationModel? = installations.find { p -> p.qrcode == QRCode && p.userid == userID }
            if (foundSite != null)
            {
                site.value = foundSite
            }
        }
    //--------------------------------------------------------------------------------------------------
    override fun update(userID: String,site: InstallationModel) {

            val foundSite: InstallationModel? = installations.find { p -> p.id == site.id }
            if (foundSite != null) {
                foundSite.description = site.description

                Timber.i("update  sites : $installations")
            }


    }

    //--------------------------------------------------------------------------------------------------
    override fun findAllForUser(userID: UInt, installationList: MutableLiveData<List<InstallationModel>>) {
        if (userID != null){
            var url = preferences.getString("API_Endpoint",TEST_API_ENDPOINT).toString()

            url = url + "/Installation/user/"+userID
            val request: StringRequest = object : StringRequest(Request.Method.GET, url, object : Response.Listener<String?> {
                    override fun onResponse(response: String?) {
                        val jsonArray = JSONArray(response)
                        if (jsonArray.length()>0) {
                            //clear existing site list
                            installations.clear()
                            for (index in 0 until jsonArray.length()){
                                val jsonObject = jsonArray.getJSONObject(index)
                                val myInstallation =InstallationModel()
                                myInstallation.id = jsonObject.getLong("id").toString()
                                myInstallation.userid = jsonObject.getLong("UserID").toUInt()
                                myInstallation.description = jsonObject.getString("Description")
                                if (myInstallation.userid == userID) {
                                    installations.add(myInstallation)
                                }
                             }
                            installationList.value= installations
                        }


                    }
                }, object : Response.ErrorListener {
                    override fun onErrorResponse(error: VolleyError?) {
                        // displaying toast message on response failure.
                        Timber.i("Send readAllInstallation for user  Error " + error.toString())
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

    override fun findById(userID: UInt, siteID: String, site: MutableLiveData<InstallationModel>) {
        TODO("Not yet implemented")
    }


}

