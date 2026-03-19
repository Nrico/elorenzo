export interface ButtonEntry {
  label: string;
  url: string;
  style: 'primary' | 'outline';
}

export interface LinkEntry {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  detailImageUrl: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  buttons?: ButtonEntry[];
  links?: LinkEntry[];
  images?: string[];
}

export const projects: Project[] = [
  {
    id: 'neural-topography',
    title: 'Neural Topography',
    category: 'Code / Art',
    year: '2024',
    description: 'A deep exploration into the intersection of neural networks and topographic mapping.',
    fullDescription: 'A deep exploration into the intersection of neural networks and topographic mapping. This project utilizes custom algorithms to translate data streams into fluid, organic landscapes that evolve in real-time. The inspiration stems from the hidden patterns found in both biological systems and computational structures, aiming to bridge the gap between the organic and the digital.\n\nTechnical execution involved high-performance GLSL shaders and a custom React-based framework for handling high-frequency data inputs. Every curve and elevation is calculated on-the-fly, ensuring that no two views of the topography are ever identical, reflecting the ephemeral nature of digital thought.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU20LL8jjY5VmkUiBtDd8M7XGXv0u7WXmbPXgd7qmCFDTINyFflrurpimt2JuASdL8iZZBZyOakUv2F4xg0oRBkdSN2WD96DzWOaSlT0B_PNolZWZGPtkr_0PSfnwd6FXQe57ObPCBp104e7X635yqxn1rBvvK1CEtnvbLUkheaYWZUNa9mqEf5qnREue0MtyaYgDjPCxUMFhQTljWqxSV8MwRRFRuBPkAEvx6wkyVoGDx0WuM6-vFAGRai0ZWe1NJ9ToHKwidOtk',
    detailImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuuPTxbvY_xmbw8gQkTjXjjU-2iZOIKPr2JElWHgK3YXm81hniTszqFjd1PLve8jnghiV__TXQLre4WyxW8BAdbgvaHfrMMu5sqm6MQqAuRR7Q75FvRDbzabuFEwOfZeQfNV7HpbJdmltrHBg85aZIrs7mpMpKwMpulWlrwkWcry7YdFb_dvGgWnIV8eKXCfTQj0U42LE5lNuUMshTmcCIxXxP3jdS9tUy6QJF6qG_UCuHAgQlHHWiZUcBmzy8YRoDjkJgViqqXOY',
    tags: ['GLSL', 'React', 'Generative']
  },
  {
    id: 'react-system-design',
    title: 'React System Design',
    category: 'Code',
    year: '2024',
    description: 'Clean React code architecture for high-scale applications.',
    fullDescription: 'An architectural study on building scalable React applications. This project focuses on modularity, type safety, and performance optimization in complex front-end systems.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCdRIy2u2v_kN-tQtoRpiKNcQGGbq8H2M96v0HfgZAAztWzVv41voLfwuveyEq3eRE9ohDAYTwhrRQnAjTvtGwL4FCJNisIr2w5moMqMsLdvx3si5qaaponVtis4H30d6PTNQswRf-eKXcoLWkvCZdR_4kOSz_Zj_UQGLsH_zwnjTRxge2aGo0ZkXnZ1FQ2ClrSlLrQmArY-rCWz5rc6TEMhPg24AQTU6Cf01c2B6w8EKHm07b0uSvCutkyCFeelakfb0dfXrv0Lc',
    detailImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCdRIy2u2v_kN-tQtoRpiKNcQGGbq8H2M96v0HfgZAAztWzVv41voLfwuveyEq3eRE9ohDAYTwhrRQnAjTvtGwL4FCJNisIr2w5moMqMsLdvx3si5qaaponVtis4H30d6PTNQswRf-eKXcoLWkvCZdR_4kOSz_Zj_UQGLsH_zwnjTRxge2aGo0ZkXnZ1FQ2ClrSlLrQmArY-rCWz5rc6TEMhPg24AQTU6Cf01c2B6w8EKHm07b0uSvCutkyCFeelakfb0dfXrv0Lc',
    tags: ['TypeScript', 'Architecture', 'React']
  },
  {
    id: 'generative-grid-01',
    title: 'Generative Grid 01',
    category: 'Art',
    year: '2023',
    description: 'Geometric patterns explored through algorithmic randomness.',
    fullDescription: 'A series of generative artworks exploring the boundaries of grid-based systems and controlled randomness.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBieRR1M40Hrbf8baQ6iNzu_yEviz48unxY3H7Q5oe8k-7-gY7seK0v3a_OCdVnbBtc291O8npS7KQ7Kq_MT-AcVtD5ZK_Zp_mzGCmqbHogMJdROatvzpcraU_cQlDhbxNYBwFfAnBpM5Mg909wYX1-Ye8rT0epqrdQdB-B-jkHU9nA0ICq76qnQAVeFw7y5EIeb7LEV6gsfOv6DBRzyuDUq-J1jJsqeTd1fI3RvNs_eq9Cbk6zPAjvVchLByMeZE51xVfzUWRVBlc',
    detailImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBieRR1M40Hrbf8baQ6iNzu_yEviz48unxY3H7Q5oe8k-7-gY7seK0v3a_OCdVnbBtc291O8npS7KQ7Kq_MT-AcVtD5ZK_Zp_mzGCmqbHogMJdROatvzpcraU_cQlDhbxNYBwFfAnBpM5Mg909wYX1-Ye8rT0epqrdQdB-B-jkHU9nA0ICq76qnQAVeFw7y5EIeb7LEV6gsfOv6DBRzyuDUq-J1jJsqeTd1fI3RvNs_eq9Cbk6zPAjvVchLByMeZE51xVfzUWRVBlc',
    tags: ['Generative', 'Art', 'Geometry']
  },
  {
    id: 'ui-logic-architecture',
    title: 'UI Logic Architecture',
    category: 'Exploration',
    year: '2024',
    description: 'Technical architectural drawing of a user interface.',
    fullDescription: 'Visualizing the underlying logic and flow of complex user interfaces through technical diagrams and architectural studies.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByTVKDQk4BaKMW2Bfs5JkJxU0nXDRqcXZw6zMeaXxYwcMG135yycNBfald43M04kihHi5D3jW9Hm6rsmMhJoZMvMuWPfTDNOYst4cu6R7vbEGPLUxXw4U1CAxSAcu1n-ACc55vAP2vNGPgq4vGkMM0DN8U69kpJzMPKPW2TZIpqLGz56izZUb0jJHbjzEHx5Sm3tc9Y2oSaKSxZ7CaXzKL0p2nAHLAT1HLGYPBefi_cCJvLZkIKm1lMNswl3Lx8k54YA1-1S9NF_M',
    detailImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByTVKDQk4BaKMW2Bfs5JkJxU0nXDRqcXZw6zMeaXxYwcMG135yycNBfald43M04kihHi5D3jW9Hm6rsmMhJoZMvMuWPfTDNOYst4cu6R7vbEGPLUxXw4U1CAxSAcu1n-ACc55vAP2vNGPgq4vGkMM0DN8U69kpJzMPKPW2TZIpqLGz56izZUb0jJHbjzEHx5Sm3tc9Y2oSaKSxZ7CaXzKL0p2nAHLAT1HLGYPBefi_cCJvLZkIKm1lMNswl3Lx8k54YA1-1S9NF_M',
    tags: ['UI', 'Logic', 'Design']
  },
  {
    id: 'data-sculpture',
    title: 'Data Sculpture',
    category: 'Exploration',
    year: '2023',
    description: 'Minimalist data visualization chart in monochrome.',
    fullDescription: 'Transforming raw data into aesthetic sculptures that reveal hidden trends and patterns through minimalist visualization.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxDBOxhzPmOdsc8LQQMvPV9n7EmQ0Bn4BYnG3Bjy38MGm_geSHWj6YHargXQlfGx32eFLXQ9foblxvJUP-UL8_4LU7yrdgUkPZu-AFDU_c-e7YagVs4bZG066Z4L7VYMrf6aJIKGELtH2YdbFOFXNk0kq2NcgAfAvkSfqZHE6d5xfbrCjvDXeRLVwMP3kGVFwcOyUDYbknLu6h-BhCcZuMWji_hOr4DKBDDLkPD-SmYEg3tUbiapcfm3en6mNmLNcF9dAQatdw3Hs',
    detailImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxDBOxhzPmOdsc8LQQMvPV9n7EmQ0Bn4BYnG3Bjy38MGm_geSHWj6YHargXQlfGx32eFLXQ9foblxvJUP-UL8_4LU7yrdgUkPZu-AFDU_c-e7YagVs4bZG066Z4L7VYMrf6aJIKGELtH2YdbFOFXNk0kq2NcgAfAvkSfqZHE6d5xfbrCjvDXeRLVwMP3kGVFwcOyUDYbknLu6h-BhCcZuMWji_hOr4DKBDDLkPD-SmYEg3tUbiapcfm3en6mNmLNcF9dAQatdw3Hs',
    tags: ['Data', 'Viz', 'Minimalism']
  },
  {
    id: 'monochrome-shadows',
    title: 'Monochrome Shadows',
    category: 'Art',
    year: '2023',
    description: 'Abstract shadow photography on white concrete wall.',
    fullDescription: 'A photographic study of light and shadow, capturing the ephemeral beauty of geometric projections on architectural surfaces.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfwfghU2vdeoBJDY4IbrG7Vpo-GVkj-L66D9g6TSlJ8FfvPbpvHViKqsq3t6qQb8OfIKdVvdOPvVNYqPCNSkLO_AkyJgqouQQopetM_THzXBlmta_PLn3KJnFgnMIIaXJNhK0EHBTeel0Icq0IE23EiebLyTViUpyeKqOyuFvCprbto9iB-7b-MyssHglofrgrHaQ4zu0-WnQx2oSuAynvWSORwBdt8C08N55rQs0ZKQepE2-3Gz4V9yd6Ru-nUatl4u-c689x4eA',
    detailImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfwfghU2vdeoBJDY4IbrG7Vpo-GVkj-L66D9g6TSlJ8FfvPbpvHViKqsq3t6qQb8OfIKdVvdOPvVNYqPCNSkLO_AkyJgqouQQopetM_THzXBlmta_PLn3KJnFgnMIIaXJNhK0EHBTeel0Icq0IE23EiebLyTViUpyeKqOyuFvCprbto9iB-7b-MyssHglofrgrHaQ4zu0-WnQx2oSuAynvWSORwBdt8C08N55rQs0ZKQepE2-3Gz4V9yd6Ru-nUatl4u-c689x4eA',
    tags: ['Photography', 'Light', 'Minimalism']
  }
];
