import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { 
    IonModal, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons,
    IonSearchbar,
    IonSpinner
} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Ubicacion } from '../../types/types';
import '../styles/LocationPicker.scss';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 8.8803, // La Chorrera, Panamá
    lng: -79.7833
};

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ubicacion: Ubicacion) => void;
    initialLocation?: Ubicacion;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    initialLocation 
}) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries
    });

    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
        initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
    );
    const [nombreLugar, setNombreLugar] = useState(initialLocation?.nombreLugar || '');
    const [center, setCenter] = useState(
        initialLocation 
            ? { lat: initialLocation.lat, lng: initialLocation.lng }
            : defaultCenter
    );

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarker({ lat, lng });
            
            // Geocodificar para obtener el nombre del lugar
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    setNombreLugar(results[0].formatted_address);
                }
            });
        }
    }, []);

    const onPlaceSelected = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMarker({ lat, lng });
                setCenter({ lat, lng });
                setNombreLugar(place.formatted_address || place.name || '');
                
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(15);
                }
            }
        }
    };

    const handleConfirm = () => {
        if (marker && nombreLugar) {
            onSelect({
                lat: marker.lat,
                lng: marker.lng,
                nombreLugar
            });
            onClose();
        }
    };

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    if (loadError) {
        return <div>Error al cargar Google Maps</div>;
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="location-picker-modal">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose} color="medium">
                            <FontAwesomeIcon icon={faTimes} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Seleccionar Ubicación</IonTitle>
                    <IonButtons slot="end">
                        <IonButton 
                            onClick={handleConfirm} 
                            disabled={!marker || !nombreLugar}
                            color="primary"
                            fill="solid"
                        >
                            <FontAwesomeIcon icon={faCheck} style={{ marginRight: '6px' }} />
                            Confirmar
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="location-picker-content">
                {!isLoaded ? (
                    <div className="loading-container">
                        <IonSpinner name="crescent" />
                        <p>Cargando mapa...</p>
                    </div>
                ) : (
                    <>
                        <div className="search-container">
                            <Autocomplete
                                onLoad={(autocomplete) => {
                                    autocompleteRef.current = autocomplete;
                                }}
                                onPlaceChanged={onPlaceSelected}
                            >
                                <input 
                                    type="text"
                                    placeholder="Buscar lugar o dirección..."
                                    className="location-search-input"
                                />
                            </Autocomplete>
                        </div>
                        
                        <div className="map-container">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={center}
                                zoom={12}
                                onClick={onMapClick}
                                onLoad={onMapLoad}
                                options={{
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false
                                }}
                            >
                                {marker && (
                                    <Marker 
                                        position={marker}
                                        animation={google.maps.Animation.DROP}
                                    />
                                )}
                            </GoogleMap>
                        </div>

                        {marker && nombreLugar && (
                            <div className="selected-location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                                <div className="location-info">
                                    <p className="location-name">{nombreLugar}</p>
                                    <p className="location-coords">
                                        {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="instructions">
                            <p>Busca un lugar en la barra de búsqueda o haz clic en el mapa para seleccionar la ubicación del evento.</p>
                        </div>
                    </>
                )}
            </IonContent>
        </IonModal>
    );
};

export default LocationPicker;
