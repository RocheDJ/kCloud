package ie.djroche.kcloud.models

import android.app.Application
import android.content.SharedPreferences
import androidx.lifecycle.MutableLiveData
import androidx.preference.PreferenceManager
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.StringRequest
import org.json.JSONArray
import org.json.JSONObject
import timber.log.Timber

class PVO_Manager(application: Application) : PVOStore {
    private var application: Application = Application()
    private var preferences: SharedPreferences
    private var titles = mutableListOf<PVOTitleModel>()  // for JSON

    init {
        this.application = application
        preferences = PreferenceManager.getDefaultSharedPreferences(application.applicationContext)

    }

    //----------------------------------------------------------------------------------------------------------
    override fun findTitles(
        userID: UInt,
        siteID: String,
        titleList: MutableLiveData<List<PVOTitleModel>>
    ) {
        var url = preferences.getString("API_Endpoint",TEST_API_ENDPOINT).toString()
        url = url + "/pvo/title/" + siteID
        val request: StringRequest =
            object : StringRequest(Method.GET, url, object : Response.Listener<String?> {
                override fun onResponse(response: String?) {
                    val jsonArray = JSONArray(response)
                    if (jsonArray.length() > 0) {
                        //clear existing site list
                        titles.clear()
                        for (index in 0 until jsonArray.length()) {
                            val jsonObject = jsonArray.getJSONObject(index)
                            val myTitle = PVOTitleModel()
                            myTitle.title = jsonObject.getString("Title")
                            titles.add(myTitle)
                        }
                        titleList.value=titles
                    }
                }
            }, object : Response.ErrorListener {
                override fun onErrorResponse(error: VolleyError?) {
                    // displaying toast message on response failure.
                    Timber.i("Send findTitles  Error " + error.toString())
                }
            }) {
                override fun getParams(): Map<String, String> {
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


    //-------------------------------------------------------------------------------------------------------------
    override fun getPVOs(
        userID: UInt,
        siteID: String,
        titleList: MutableLiveData<List<PVOTitleModel>>,
        pvoList: MutableLiveData<List<PVOModel>>
    ) {

        val PVOS = mutableListOf<PVOModel>()  // for JSON
        try {
            Timber.i("getPVO Test")
            makeTestPVOs(siteID,pvoList)
            val titles = titleList.value
            titles?.forEach{
                val myjData = PVOjDataModel()
                myjData.title = it.title
                var url = preferences.getString("API_Endpoint",TEST_API_ENDPOINT).toString()
                url = url + "/pvo/" + siteID +"/" + myjData.title
                val request: StringRequest = object : StringRequest(Method.GET, url, object : Response.Listener<String?> {
                    override fun onResponse(response: String?) {
                        val jsonArray = JSONArray(response)

                        val jsonObject = jsonArray.getJSONObject(0)
                        val sUnit = (jsonObject.getString("Unit"))
                        myjData.unit = sUnit
                        val fTemp = (jsonObject.getDouble("Value").toUInt())
                        myjData.value = fTemp.toString()
                        myjData.valueType = 5
                        val myPVO = PVOModel()
                        myPVO.icon = loadIcon(sUnit)
                        myPVO.jData = myjData
                        myPVO.id = 12345
                        myPVO.installationid = siteID.toUInt()
                        myPVO.EventDate = (jsonObject.getString("EventDate"))
                        PVOS.add(myPVO)
                        pvoList.value =PVOS
                    }
                }, object : Response.ErrorListener {
                    override fun onErrorResponse(error: VolleyError?) {
                        // displaying toast message on response failure.
                        Timber.i("Send findTitles  Error " + error.toString())
                    }
                }) {
                    override fun getParams(): Map<String, String> {
                        val params: MutableMap<String, String> = HashMap()
                        return params
                    }
                }
                ie.djroche.kcloud.utils.httpQueue.add(request)   // add to the app queue
            }

        } catch (e: Exception) {
            Timber.i("getPVO error : $e.message")
        }

    }

    //----------------------------------------------------------------------------------------------
    /*-------------                      Private Functions         -------------------------------*/
    fun loadIcon(unit: String): String {
        val defaultImage = "industry40.png"
        var retVal: String = defaultImage
        when (unit) {
            "C" -> retVal = "temp.png"
            "mm" -> retVal = "water-level.png"
            "L" -> retVal = "tank.png"
            "kWh" -> retVal = "power-meter.png"
            "QI" -> retVal = "motor.png"
            "uS" -> retVal = "conductivity.png"
            else -> {
                retVal = defaultImage
            }
        }

        return retVal
    }

    //---------------------------------------- Make Test Data ------------------------------------------
    fun makeTestPVOs( siteID: String, PVOList:  MutableLiveData<List<PVOModel>> ){
        val PVOS = mutableListOf<PVOModel>()  // for JSON
        for (index in 0 until 4) {
            val myjData = PVOjDataModel()
            var sUnit: String = "C"
            if (index == 1) {
                sUnit = "L"
            }
            if (index == 2) {
                sUnit = "uS"
            }
            if (index == 3) {
                sUnit = "mm"
            }
            myjData.title = "Line 2 Temp"
            myjData.unit = sUnit

            val fTemp = 15.1 + index
            myjData.value = fTemp.toString()
            myjData.valueType = 5
            val myPVO = PVOModel()
            myPVO.icon = loadIcon(sUnit)
            myPVO.id = 21839
            myPVO.installationid = siteID.toUInt()
            myPVO.EventDate = "2024-03-17T00:57:19.000Z"
            myPVO.jData = myjData
            PVOS.add(myPVO)
        }
        PVOList.value=PVOS
    }
}