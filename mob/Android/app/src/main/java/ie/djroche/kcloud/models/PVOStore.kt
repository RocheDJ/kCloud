package ie.djroche.kcloud.models
import androidx.lifecycle.MutableLiveData

interface PVOStore {
    //read the list of PVO titles
    fun findTitles(userID:UInt,
                    siteID: String,
                   titleList:
                   MutableLiveData<List<PVOTitleModel>>)

    fun getPVOs(userID:UInt,
                siteID: String,
                titleList:
                MutableLiveData<List<PVOTitleModel>>,
                pvoList:
                MutableLiveData<List<PVOModel>>)
}