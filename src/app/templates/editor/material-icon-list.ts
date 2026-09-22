export interface MaterialIconCategory {
  label: string;
  icons: string[];
}

/**
 * Material Symbols names exposed by the BRAIN TECHNO editor icon picker.
 * These names are rendered through the Material Symbols Rounded font.
 */
export const MATERIAL_ICON_CATEGORIES: MaterialIconCategory[] = [
  {
    label: 'Actions',
    icons: [
      'add','add_circle','add_box','remove','remove_circle','close','check','check_circle','done_all','cancel','delete','delete_forever','edit','save','download','upload','content_copy','content_paste','undo','redo','refresh','restart_alt','search','filter_alt','sort','more_vert','more_horiz','settings','tune','visibility','visibility_off','lock','lock_open','keep','keep_off','favorite','favorite_border','star','star_border','bookmark','bookmark_border','share','print','open_in_new','launch','link','link_off','attach_file','send','reply','forward','info','help','warning','error','verified','task_alt','history','schedule','today','event','calendar_month'
    ]
  },
  {
    label: 'Navigation',
    icons: [
      'home','menu','apps','dashboard','dashboard_customize','arrow_back','arrow_forward','arrow_upward','arrow_downward','chevron_left','chevron_right','expand_more','expand_less','first_page','last_page','north','south','east','west','navigation','near_me','my_location','explore','map','place','location_on','pin_drop','route','directions','directions_car','flight','train','local_taxi'
    ]
  },
  {
    label: 'People & Communication',
    icons: [
      'person','person_add','person_remove','group','groups','account_circle','badge','face','manage_accounts','contacts','contact_page','contact_phone','call','phone','smartphone','mail','email','alternate_email','chat','chat_bubble','forum','sms','notifications','notifications_active','campaign','support_agent','record_voice_over','mic','language','public','wifi','rss_feed'
    ]
  },
  {
    label: 'Business & Commerce',
    icons: [
      'business','apartment','store','storefront','shopping_cart','shopping_bag','add_shopping_cart','inventory','inventory_2','category','sell','local_offer','price_change','payments','paid','credit_card','account_balance','account_balance_wallet','receipt','receipt_long','request_quote','currency_rupee','currency_exchange','point_of_sale','redeem','card_giftcard','loyalty','work','work_history','corporate_fare','factory','warehouse','local_shipping','package_2','qr_code','qr_code_scanner','barcode_scanner'
    ]
  },
  {
    label: 'Media',
    icons: [
      'image','photo','photo_library','collections','gallery_thumbnail','camera_alt','photo_camera','videocam','video_library','smart_display','play_arrow','play_circle','pause','stop','skip_next','skip_previous','fast_forward','fast_rewind','volume_up','volume_off','music_note','headphones','podcasts','movie','theaters','slideshow','view_carousel','auto_awesome_motion','perm_media','panorama','crop','rotate_right','zoom_in','zoom_out','fullscreen','fullscreen_exit'
    ]
  },
  {
    label: 'Layout & Editor',
    icons: [
      'title','notes','text_fields','format_bold','format_italic','format_underlined','format_align_left','format_align_center','format_align_right','format_list_bulleted','format_list_numbered','horizontal_rule','height','width','view_quilt','view_column','view_day','view_agenda','view_module','grid_view','table_rows','table_chart','tab','web_asset','web','widgets','interests','dynamic_form','article','description','code','html','css','data_object','drag_indicator','reorder','layers','select_all','crop_square','rectangle','circle','background_grid_small','space_dashboard'
    ]
  },
  {
    label: 'Analytics & Data',
    icons: [
      'monitoring','analytics','query_stats','bar_chart','insert_chart','pie_chart','show_chart','timeline','trending_up','trending_down','insights','leaderboard','equalizer','data_usage','database','storage','cloud','cloud_upload','cloud_download','cloud_done','calculate','functions','percent','123','speed','track_changes'
    ]
  },
  {
    label: 'Devices & Technology',
    icons: [
      'computer','desktop_windows','laptop','tablet','phone_android','devices','memory','developer_board','terminal','dns','router','hub','sensors','bluetooth','usb','power','battery_full','lightbulb','bolt','flash_on','security','shield','key','fingerprint','password','vpn_key','cloud_queue','language','http','api','integration_instructions','smart_toy','psychology','auto_awesome'
    ]
  },
  {
    label: 'Time, Status & Utilities',
    icons: [
      'timer','alarm','schedule','hourglass_empty','hourglass_full','update','pending','pending_actions','sync','autorenew','toggle_on','toggle_off','radio_button_checked','radio_button_unchecked','check_box','check_box_outline_blank','progress_activity','cached','done','priority_high','report','tips_and_updates','light_mode','dark_mode','palette','color_lens','brush','format_paint','gradient','opacity'
    ]
  },
  {
    label: 'Content & Files',
    icons: [
      'folder','folder_open','create_new_folder','file_copy','file_present','draft','article','description','note','note_add','summarize','topic','attach_email','archive','unarchive','cloud_upload','upload_file','download_for_offline','picture_as_pdf','table_view','dataset','inventory_2','snippet_folder','fact_check','assignment','assignment_turned_in','list_alt'
    ]
  },
  {
    label: 'Social, Lifestyle & Misc',
    icons: [
      'thumb_up','thumb_down','sentiment_satisfied','sentiment_very_satisfied','mood','emoji_emotions','celebration','workspace_premium','military_tech','emoji_events','trophy','sports_esports','sports_soccer','fitness_center','spa','restaurant','local_cafe','local_bar','hotel','bed','chair','home_repair_service','construction','handyman','design_services','architecture','school','menu_book','science','health_and_safety','medical_services','pets','eco','park','travel_explore','beach_access','rocket_launch','diamond','workspace_premium','volunteer_activism','diversity_3'
    ]
  }
];

export const MATERIAL_ICON_LIST = Array.from(
  new Set(MATERIAL_ICON_CATEGORIES.flatMap(category => category.icons))
).sort((a, b) => a.localeCompare(b));
