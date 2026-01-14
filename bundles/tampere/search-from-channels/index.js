import './service/WfsSearchService'
import './service/ChannelOptionService'
import './instance'
import './resources/css/style.scss'

Oskari.bundle( 'search-from-channels', () =>
    Oskari.clazz.create('Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundleInstance')
);