
export interface GoogleMapsConfig {
  apiKey: string;
}

export interface RouteRequest {
  origin: string;
  destination: string;
  waypoints?: string[];
  optimizeWaypoints?: boolean;
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  avoidHighways?: boolean;
  avoidTolls?: boolean;
}

export interface DistanceMatrixRequest {
  origins: string[];
  destinations: string[];
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  unitSystem?: 'METRIC' | 'IMPERIAL';
  avoidHighways?: boolean;
  avoidTolls?: boolean;
}

export interface SnapToRoadsRequest {
  path: Array<{ lat: number; lng: number }>;
  interpolate?: boolean;
}

export interface RouteResponse {
  routes: Array<{
    legs: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      start_address: string;
      end_address: string;
      start_location: { lat: number; lng: number };
      end_location: { lat: number; lng: number };
      steps: Array<{
        distance: { text: string; value: number };
        duration: { text: string; value: number };
        html_instructions: string;
        polyline: { points: string };
        start_location: { lat: number; lng: number };
        end_location: { lat: number; lng: number };
      }>;
    }>;
    overview_polyline: { points: string };
    summary: string;
    warnings: string[];
    waypoint_order: number[];
  }>;
  status: string;
}

export interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      status: string;
    }>;
  }>;
  destination_addresses: string[];
  origin_addresses: string[];
  status: string;
}

export interface SnapToRoadsResponse {
  snappedPoints: Array<{
    location: { latitude: number; longitude: number };
    originalIndex?: number;
    placeId: string;
  }>;
}

export class GoogleMapsService {
  private static config: GoogleMapsConfig | null = null;

  static setConfig(config: GoogleMapsConfig) {
    this.config = config;
  }

  private static getApiKey(): string {
    if (!this.config?.apiKey) {
      throw new Error('API Key Google Maps non configurée. Veuillez configurer la clé dans les paramètres.');
    }
    return this.config.apiKey;
  }

  // Routes API - Calcul d'itinéraires
  static async getDirections(request: RouteRequest): Promise<RouteResponse> {
    const apiKey = this.getApiKey();
    const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    
    const params = new URLSearchParams({
      origin: request.origin,
      destination: request.destination,
      key: apiKey,
      mode: request.travelMode || 'DRIVING',
      language: 'fr',
      region: 'GA' // Gabon
    });

    if (request.waypoints && request.waypoints.length > 0) {
      params.append('waypoints', request.waypoints.join('|'));
    }

    if (request.optimizeWaypoints) {
      params.append('optimize', 'true');
    }

    if (request.avoidHighways) {
      params.append('avoid', 'highways');
    }

    if (request.avoidTolls) {
      params.append('avoid', 'tolls');
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Erreur API Directions: ${data.status} - ${data.error_message || 'Erreur inconnue'}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors du calcul d\'itinéraire:', error);
      throw error;
    }
  }

  // Distance Matrix API - Calcul de distances et temps de trajet
  static async getDistanceMatrix(request: DistanceMatrixRequest): Promise<DistanceMatrixResponse> {
    const apiKey = this.getApiKey();
    const baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    
    const params = new URLSearchParams({
      origins: request.origins.join('|'),
      destinations: request.destinations.join('|'),
      key: apiKey,
      mode: request.travelMode || 'DRIVING',
      units: request.unitSystem || 'METRIC',
      language: 'fr',
      region: 'GA' // Gabon
    });

    if (request.avoidHighways) {
      params.append('avoid', 'highways');
    }

    if (request.avoidTolls) {
      params.append('avoid', 'tolls');
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Erreur API Distance Matrix: ${data.status} - ${data.error_message || 'Erreur inconnue'}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors du calcul de distance matrix:', error);
      throw error;
    }
  }

  // Snap to Roads API - Alignement sur les routes
  static async snapToRoads(request: SnapToRoadsRequest): Promise<SnapToRoadsResponse> {
    const apiKey = this.getApiKey();
    const baseUrl = 'https://roads.googleapis.com/v1/snapToRoads';
    
    // Convertir le chemin en format requis par l'API
    const pathString = request.path
      .map(point => `${point.lat},${point.lng}`)
      .join('|');
    
    const params = new URLSearchParams({
      path: pathString,
      key: apiKey
    });

    if (request.interpolate) {
      params.append('interpolate', 'true');
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erreur API Snap to Roads: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'alignement sur les routes:', error);
      throw error;
    }
  }

  // Utilitaires pour le calcul de trajets optimisés
  static async calculateOptimalRoute(
    startPoint: string,
    endPoint: string,
    intermediatePoints: string[] = []
  ): Promise<{
    route: RouteResponse;
    totalDistance: number;
    totalDuration: number;
    estimatedFuelCost: number;
  }> {
    try {
      const routeRequest: RouteRequest = {
        origin: startPoint,
        destination: endPoint,
        waypoints: intermediatePoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING',
        avoidHighways: false,
        avoidTolls: false
      };

      const route = await this.getDirections(routeRequest);
      
      // Calculer les totaux
      let totalDistance = 0;
      let totalDuration = 0;
      
      route.routes[0]?.legs.forEach(leg => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
      });

      // Estimation du coût carburant (prix moyen au Gabon: ~650 FCFA/L, consommation: ~8L/100km)
      const fuelConsumptionPer100km = 8; // Litres
      const fuelPricePerLiter = 650; // FCFA
      const distanceInKm = totalDistance / 1000;
      const estimatedFuelCost = (distanceInKm / 100) * fuelConsumptionPer100km * fuelPricePerLiter;

      return {
        route,
        totalDistance: Math.round(totalDistance / 1000), // en km
        totalDuration: Math.round(totalDuration / 60), // en minutes
        estimatedFuelCost: Math.round(estimatedFuelCost)
      };
    } catch (error) {
      console.error('Erreur lors du calcul de trajet optimal:', error);
      throw error;
    }
  }

  // Suivi en temps réel - simuler le suivi d'un véhicule
  static async trackVehicleRoute(
    vehicleId: string,
    routePoints: Array<{ lat: number; lng: number; timestamp: string }>
  ): Promise<{
    snappedRoute: SnapToRoadsResponse;
    analysis: {
      averageSpeed: number;
      maxSpeed: number;
      totalDistance: number;
      movingTime: number;
      stoppedTime: number;
    };
  }> {
    try {
      // Aligner les points sur les routes
      const snappedRoute = await this.snapToRoads({
        path: routePoints.map(p => ({ lat: p.lat, lng: p.lng })),
        interpolate: true
      });

      // Analyser le trajet
      let totalDistance = 0;
      let totalTime = 0;
      let maxSpeed = 0;
      let movingTime = 0;
      let stoppedTime = 0;

      for (let i = 1; i < routePoints.length; i++) {
        const prevPoint = routePoints[i - 1];
        const currentPoint = routePoints[i];
        
        // Calculer la distance entre les points (formule de Haversine simplifiée)
        const distance = this.calculateDistance(
          prevPoint.lat, prevPoint.lng,
          currentPoint.lat, currentPoint.lng
        );
        
        // Calculer le temps écoulé
        const timeDiff = (new Date(currentPoint.timestamp).getTime() - 
                         new Date(prevPoint.timestamp).getTime()) / 1000; // en secondes
        
        if (timeDiff > 0) {
          const speed = (distance / timeDiff) * 3.6; // km/h
          
          totalDistance += distance;
          totalTime += timeDiff;
          
          if (speed > maxSpeed) {
            maxSpeed = speed;
          }
          
          if (speed > 5) { // Considéré comme en mouvement si > 5 km/h
            movingTime += timeDiff;
          } else {
            stoppedTime += timeDiff;
          }
        }
      }

      const averageSpeed = totalTime > 0 ? (totalDistance / totalTime) * 3.6 : 0;

      return {
        snappedRoute,
        analysis: {
          averageSpeed: Math.round(averageSpeed),
          maxSpeed: Math.round(maxSpeed),
          totalDistance: Math.round(totalDistance),
          movingTime: Math.round(movingTime / 60), // en minutes
          stoppedTime: Math.round(stoppedTime / 60) // en minutes
        }
      };
    } catch (error) {
      console.error('Erreur lors du suivi du véhicule:', error);
      throw error;
    }
  }

  // Fonction utilitaire pour calculer la distance entre deux points
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Rayon de la Terre en mètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Géocodage inverse - obtenir l'adresse à partir des coordonnées
  static async reverseGeocode(lat: number, lng: number): Promise<string> {
    const apiKey = this.getApiKey();
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    
    const params = new URLSearchParams({
      latlng: `${lat},${lng}`,
      key: apiKey,
      language: 'fr',
      region: 'GA'
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }
}
