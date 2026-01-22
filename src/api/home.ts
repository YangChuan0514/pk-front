import { http } from '@/utils/axios'
import type { ApiResponse } from '@/utils/axios'
import type { SwiperItemType, ProjectType, LessonType, PartnerType } from './type/home'
export interface HomeData {
  swiper: SwiperItemType[]
  projects: ProjectType[]
  lessons: LessonType[]
  partners: PartnerType[]
}
export const getHomeData = (): Promise<ApiResponse<HomeData>> => {
  return http.get('/api/home')
}