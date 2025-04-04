export interface Model {
  id: string
  name: string
  image: string
  email: string
  phone: string
  location: string
  available: boolean
}

export interface DatabaseModel {
  id: string
  name: string
  email: string
  phone: string
  location: string
  image_url: string | null
  available: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  model_id: string
  client_name: string
  client_email: string
  event_name: string
  start_date: string
  end_date: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

// Convert database model to frontend model
export function mapDatabaseModelToModel(dbModel: DatabaseModel): Model {
  return {
    id: dbModel.id,
    name: dbModel.name,
    email: dbModel.email,
    phone: dbModel.phone,
    location: dbModel.location,
    image: dbModel.image_url || "/placeholder.svg?height=400&width=300",
    available: dbModel.available,
  }
}

